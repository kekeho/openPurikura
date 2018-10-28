// スタンプとテキストの親クラス
class PutObject extends DrawObject {
  constructor(log, color, size) {
    super(log);
    
    this._color = color;
    this._size = size;
    this._angle = 0;

    this.x = canv_main.width / 2;
    this.y = canv_main.height / 2;
  }

  // 色を設定
  set color(stamp_color) {
    this._color = stamp_color;
    this.redraw();
  }

  get color() {
    return this._color;
  }

  // サイズを設定
  set size(stamp_size) {
    this._size = stamp_size;
    this.redraw();
  }

  get size() {
    return this._size;
  }

  // 角度を設定
  set angle(stamp_angle) {
    this._angle = stamp_angle;
    this.redraw();
  }

  get angle() {
    return this._angle;
  }

  // 移動
  move(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  // 再描画
  redraw() {
    this.move(this.x, this.y);
  }
}

// スタンプ
class Stamp extends PutObject {
  constructor(log, color, size, type, num) {
    super(log, color, size);
    let _this = this;
    
    console.log("(" + this.x + ", " + this.y + ")");
    this.type = type;
    this.num = num;

    // 画像を読み込み
    this.img = new Image();
    this.img.src = "./assets/stamp/" + this.type + "/" + this.num + "/" + this._color.id + ".png";
    this.img.onload = function(e) {
      _this.redraw();
    }

    cur_tool = ID_TOOL.stamp;
  }

  // 色を設定
  set color(stamp_color) {
    let _this = this;

    this._color = stamp_color;
    this.img.src = "./assets/stamp/" + this.type + "/" + this.num + "/" + this._color.id + ".png";
    this.img.onload = function(e) {
      _this.redraw();
    }
  }

  // 移動
  move(_x, _y) {
    this.x = _x;
    this.y = _y;

    this.clear();

    ctx_edit.save();
    ctx_edit.translate(this.x, this.y);
    ctx_edit.rotate(this.angle * (Math.PI / 180));
    ctx_edit.translate(-this.x, -this.y);
    ctx_edit.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx_edit.restore();
  }
}

// テキスト
class Text extends PutObject {
  constructor(log, color, size, text) {
    super(log, color, size);
    
    this.text = text;
    this.redraw();

    cur_tool = ID_TOOL.stamp;
  }

  // 移動
  move(_x, _y) {
    this.x = _x;
    this.y = _y;

    this.clear();

    // フォントの設定
    ctx_edit.fillStyle = this._color.str_color;
    ctx_edit.textAlign = "center";
    ctx_edit.font = this.size + "px 'ヒラギノ角ゴシック'";

    ctx_edit.save();
    ctx_edit.translate(this.x, this.y);
    ctx_edit.rotate(this.angle * (Math.PI / 180));
    ctx_edit.translate(-this.x, -this.y);
    ctx_edit.fillText(this.text, this.x, this.y + this.size / 3);
    ctx_edit.restore();
  }
}