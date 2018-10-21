//文字列の取得
function loadText(){
  return input_text = textField.value;
}

function Text(text, x, y, fontsize, fontWeight){
  this.text = text;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.count = tc++;
  this.fontsize = fontsize;
  this.fontWeight = fontWeight;

  //編集用のキャンバス
  this.canvas = document.createElement("canvas");
  this.canvas.id = "editCanvas" ;//+ this.count;
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;

  //キャンバスをスクリーン上に追加
  this.textBox = document.getElementById("canvas-box");
  this.textBox.appendChild(this.canvas);
  
  this.ctx = this.canvas.getContext('2d');
  this.ctx.font = 'ヒラギノ角ゴシック','Hiragino Sans';
//  this.ctx.font = this.fontWeight + " 'ヒラギノ角ゴシック'",this.fontWeight + " "'Hiragino Sans'";
  
  //モード変更
  workMode = modeName.txediting;

  //リサイズ
  this.resize = function (newSize){
    this.fontsize = newSize;
    this.move(this.x, this.y);
  }
  
  //伊藤...
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.save();
    this.ctx.fillStyle = "rgb("  + pColor.r + "," + pColor.g + "," + pColor.b + ")";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = 'ヒラギノ角ゴシック','Hiragino Sans';
    this.canvas.id = "editCanvas" + fontWeight;
    this.ctx.textAlign = "center";
    this.ctx.font = this.fontsize + "px serif";
    console.log(this.text.trim().length);

    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle * (Math.PI/180));
    this.ctx.translate(-this.x, -this.y);

    //this.ctx.translate(this.x, this.y);
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.restore();
  }

  //回転操作　wayに応じて回転方向を変える
  this.spin = function(dir) {
    //dirの向きにだけ3度回転させる
    this.angle += dir * 10;
    this.move(this.x, this.y);
  }

  //配置キャンセル
  this.cancel = function(){
    this.textBox.removeChild(this.canvas);
    workMode = modeName.drawing;
  }

  //配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }

}

function txResize(_scale) {
  text.resize(text.fontsize * _scale);
}
