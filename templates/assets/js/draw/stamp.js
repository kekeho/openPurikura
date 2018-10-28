// スタンプ
class Stamp extends DrawObject {
  constructor(log, type, num, color, size) {
    super(log);
    
    this.type = type;
    this.num = num;
    this._color = color;
    this._size = size;
    this._angle = 0;

    this.x = canv_main.width / 2;
    this.y = canv_main.height / 2;

    // 画像を読み込み
    this.img = new Image();
    this.img.src = "./assets/stamp/" + this.type + "/" + this.num + "/" + this.color.id + ".png";

    cur_tool = ID_TOOL.stamp;
  }

  // 色を設定
  set color(stamp_color) {
    let _this = this;

    this._color = stamp_color;
    this.img.src = "./assets/stamp/" + this.type + "/" + this.num + "/" + this.color.id + ".png";
    this.img.onload = function(e) {
      _this.redraw();
    }
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

    this.clear();

    ctx_edit.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx_edit.save();
    ctx_edit.translate(this.x, this.y);
    ctx_edit.rotate(this.angle * (Math.PI / 180));
    ctx_edit.restore();
  }

  // 再描画
  redraw() {
    this.move(this.x, this.y);
  }
}
