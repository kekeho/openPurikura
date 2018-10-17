=begin

コマンドライン引数として、IDと添付枚数を指定
ARGV[0]:ID, ARGV[1]:添付枚数

送信先のデータベース("openPurikura.db")の指定されたIDに、指定された数の画像を添付しメールを送信します。
IDのかぶりにも対応。
画像は、"image_'ID'_'枚数'.png"を送信します。
例えば、IDが10の方に画像を3枚送信する場合、
"image_10_1.png","image_10_2.png","image_10_3.png"の3枚が送られます。

データベースの情報が代入される変数↓↓↓↓↓↓
row[0]：送信先ID
row[1]：送信先ニックネーム
row[2]：送信先メールアドレス
row2[0]：送信元ID
row2[1]：送信元メールアドレス
row2[2]：送信設定address
row2[3]：送信設定port
row2[4]：送信設定domain
row2[5]：送信設定user_name
row2[6]：送信設定password

=end

#送信元のメールアドレスを指定(現状1~7までデータベースに存在)
SELECT_FM = 1

###


require 'mail'
require 'sqlite3'

#IDの指定がない場合、終了
if ARGV[0] == nil then
	puts "IDの指定がないため終了"
	exit!
end

#添付枚数の指定がない場合、添付枚数を1にする
if ARGV[1] == nil then
	ARGV[1] = 1
end

tdb = SQLite3::Database.new 'openPurikura.db'
fdb = SQLite3::Database.new 'maillist.db'

tdb.execute("select * from users where id = '#{ARGV[0]}'") do |row|
  	print "id:#{row[0]} name:#{row[1]} mail:#{row[2]} 添付画像数:#{ARGV[1]}\n"

  	fdb.execute("select * from FromMail where id = #{SELECT_FM}") do |row2|

  		print "#{row2[1]}から送信されます。\n"

		mail = Mail.new
		options =
		{
			:address				=> "#{row2[2]}",
		    :port					=> "#{row2[3]}",
		    :domain					=> "#{row2[4]}",
		    :user_name				=> "#{row2[5]}",
		    :password				=> "#{row2[6]}",
		    :authentication			=> :plain,
		    :enable_starttls_auto	=> true
		}
		mail.charset = 'utf-8'								#文字コードの指定
		mail.from "#{row2[1]}"								#送信元メールアドレス
		mail.to "#{row[2]}"   								#送信先メールアドレス
		mail.subject "プリクラ：#{row[1]}"						#メールタイトル
		mail.body "ほんぶん"									#メール本文
		for num in 1..ARGV[1].to_i do
			mail.add_file "./image_#{ARGV[0]}_#{num}.png"	#添付画像
		end
		mail.delivery_method(:smtp, options)				#設定の読み込み
		mail.deliver 										#メールの送信
	end
end