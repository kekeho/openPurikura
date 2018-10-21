var stamp_type = "";
var stamp_num = 1;

// スタンプ読み込み
function loadStamp(_type, _num) {
  if (workMode == modeName.txediting) {
    text.apply();
    createCache();
    text = null;
  }

  stamp_type = _type;
  stamp_num = _num;
  stampImg = new Image();

  let colorName = "";

  switch (currentColor) {
    case penColor.deepred:
      colorName = "DeepRed";
      break;
    case penColor.red:
      colorName = "Red";
      break;
    case penColor.salmonpink:
      colorName = "SalmonPink";
      break;
    case penColor.hotpink:
        colorName = "HotPink";
      break;
    case penColor.pink:
      colorName = "Pink";
      break;
    
    case penColor.purple:
      colorName = "Purple";
      break;
    case penColor.blue:
      colorName = "Blue";
      break;
    case penColor.deepblue:
      colorName = "DeepBlue";
      break;
    case penColor.lightblue:
      colorName = "LightBlue";
      break;
    case penColor.vividblue:
      colorName = "VividBlue";
      break;
    
    case penColor.green:
      colorName = "Green";
      break;
    case penColor.yellow:
      colorName = "Yellow";
      break;
    case penColor.vividorange:
      colorName = "VividOrange";
      break;
    case penColor.orange:
      colorName = "Orange";
      break;
    case penColor.beige:
      colorName = "Beige";
      break;
    
    case penColor.vividgreen:
      colorName = "VividGreen";
      break;
    case penColor.darkgreen:
      colorName = "DarkGreen";
      break;
    case penColor.gray:
      colorName = "Gray";
      break;
    case penColor.black:
      colorName = "Black";
      break;
    case penColor.white:
      colorName = "White";
      break;
  }

  stampImg.src = "./assets/stamp/" + stamp_type + "/" + stamp_num + "/" + stamp_num + "-" + colorName +  ".png";

  workMode = modeName.stamping;
}

// スタンプを表すオブジェクト
function Stamp(img, x, y, scale, type, num) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.scale = scale;
  this.w = this.img.width * this.scale;
  this.h = this.img.height * this.scale;
  this.type = type;
  this.num = num;
  this.angle = 0;

  // 編集用キャンバス作成
  this.canvas = document.createElement("canvas");
  this.canvas.id = "editCanvas";
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;

  this.stampBox = document.getElementById("canvas-box");
  this.stampBox.appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2);

  // モード変更
  workMode = modeName.stediting;

  // 移動
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    this.ctx.translate(this.x , this.y );
    this.ctx.rotate(this.angle * (Math.PI/180));
    this.ctx.translate(-this.x, -this.y);

    this.resize(this.scale);
    this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2);
    this.ctx.restore();
  }

  // リサイズ
  this.resize = function(scale) {
    this.scale = scale;
    this.w = this.img.width * this.scale;
    this.h = this.img.height * this.scale;

    let temp = document.createElement("canvas"); 
    temp.width = this.w;
    temp.height = this.h;
    let tctx = temp.getContext("2d");
    tctx.scale(this.scale, this.scale);
    tctx.drawImage(this.img, 0, 0);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(temp, this.x - this.w / 2, this.y - this.h / 2);
  }

  // 色変更
  this.recolor = function(id){
    let colorName = "";
    switch (id) {
      case penColor.deepred:
        colorName = "DeepRed";
        break;
      case penColor.red:
        colorName = "Red";
        break;
      case penColor.salmonpink:
        colorName = "SalmonPink";
        break;
      case penColor.hotpink:
          colorName = "HotPink";
        break;
      case penColor.pink:
        colorName = "Pink";
        break;
      
      case penColor.purple:
        colorName = "Purple";
        break;
      case penColor.blue:
        colorName = "Blue";
        break;
      case penColor.deepblue:
        colorName = "DeepBlue";
        break;
      case penColor.lightblue:
        colorName = "LightBlue";
        break;
      case penColor.vividblue:
        colorName = "VividBlue";
        break;
      
      case penColor.green:
        colorName = "Green";
        break;
      case penColor.yellow:
        colorName = "Yellow";
        break;
      case penColor.vividorange:
        colorName = "VividOrange";
        break;
      case penColor.orange:
        colorName = "Orange";
        break;
      case penColor.beige:
        colorName = "Beige";
        break;
      
      case penColor.vividgreen:
        colorName = "VividGreen";
        break;
      case penColor.darkgreen:
        colorName = "DarkGreen";
        break;
      case penColor.gray:
        colorName = "Gray";
        break;
      case penColor.black:
        colorName = "Black";
        break;
      case penColor.white:
        colorName = "White";
        break;
    }
  
    _img = new Image();
    _img.src = "./assets/stamp/" + this.type + "/" +this. num + "/" + this.num + "-" + colorName +  ".png";
    this.img = _img;
  }

  this.spin = function(dir) {
    //dirの向きにだけ3度回転させる
    this.angle += dir * 10;
    this.move(this.x, this.y);
  }

  // 配置キャンセル
  this.cancel = function() {
    this.stampBox.removeChild(this.canvas);
    workMode = modeName.drawing;
    stamp = null;
  }

  // 配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }
}

// onclickで呼ばれる スタンプをリサイズ
function stResize(_scale){
  stamp.resize(stamp.scale * _scale);
}

// onclickで呼ばれる スタンプをリカラー
function stRecolor(_id){
  // loadStamp(stamp.type, stamp.num);
  stamp.recolor(_id);
  //stamp.move(stamp.x, stamp.y);
}
