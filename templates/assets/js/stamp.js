// スタンプ読み込み
function loadStamp() {
  stampImg = new Image();
  stampImg.src = "./assets/stamp/stamp.png";
}

// スタンプを表すオブジェクト
function Stamp(img, x, y, scale) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = img.width;
  this.h = img.height;
  this.scale = scale;

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
  pen_button.className = '';
  era_button.className = '';
  sta_button.className = 'active';
  workMode = modeName.editing;

  // 移動
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2);
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

  // 配置キャンセル
  this.cancel = function() {
    this.stampBox.removeChild(this.canvas);
  }

  // 配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }
}
