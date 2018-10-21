// idをカラーネームに変更
function colorName(_id){
  switch (_id) {
    case penColor.deepred:
      return "DeepRed";
    case penColor.red:
      return "Red";
    case penColor.salmonpink:
      return "SalmonPink";
    case penColor.hotpink:
        return "HotPink";
    case penColor.pink:
      return "Pink";
    
    case penColor.purple:
      return "Purple";
    case penColor.blue:
      return "Blue";
    case penColor.deepblue:
      return "DeepBlue";
    case penColor.lightblue:
      return "LightBlue";
    case penColor.vividblue:
      return "VividBlue";
    
    case penColor.green:
      return "Green";
    case penColor.yellow:
      return "Yellow";
    case penColor.vividorange:
      return "VividOrange";
    case penColor.orange:
      return "Orange";
    case penColor.beige:
      return "Beige";
    
    case penColor.vividgreen:
      return "VividGreen";
    case penColor.darkgreen:
      return "DarkGreen";
    case penColor.gray:
      return "Gray";
    case penColor.black:
      return "Black";
    case penColor.white:
      return "White";
  }
}

// imageを読み込む
function loadImage(_type, _num, _id){
  _img = new Image();
  _img.src = "./assets/stamp/" + _type + "/" + _num + "/" + _num + "-" + colorName(_id) +  ".png";
  return _img;
}

function Stamp(_x, _y, _size, _type, _num){
  this.x = _x;
  this.y = _y;
  this.angle = 0;
  this.size = _size;

  this.type = _type;
  this.num = _num;

  // 編集用キャンバス作成
  this.canvas = document.createElement("canvas");
  this.canvas.id = "editCanvas";
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;

  // キャンバスをスクリーン上に追加
  this.stampBox = document.getElementById("canvas-box");
  this.stampBox.appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");

  // モード変更
  workMode = modeName.stediting;

  //リサイズ
  this.resize = function (_size){
    this.size = _size;
    this.move(this.x, this.y);
  }

  // 描画
  this.move = function(_x, _y) {
    this.x = _x;
    this.y = _y;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.id = "editCanvas";
    
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle * (Math.PI/180));
    this.ctx.translate(-this.x, -this.y);
    
    _img = loadImage(this.type, this.num, pColor.id);
    this.ctx.drawImage(_img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    console.log("x:" + this.x + " / y:" + this.y + " / size:" + this.size);
    this.ctx.restore();
  }

  //回転操作　wayに応じて回転方向を変える
  this.spin = function(dir) {
    //dirの向きにだけ3度回転させる
    this.angle += dir * 3;
    this.move(this.x, this.y);
  }

  // 配置キャンセル
  this.cancel = function() {
    this.stampBox.removeChild(this.canvas);
    workMode = modeName.drawing;
  }

  // 配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }
}

function stResize(_plus){
  stamp.resize(stamp.size + _plus);
}