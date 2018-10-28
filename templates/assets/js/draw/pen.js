// ノーマルなペン
class Pen extends DrawObject {
  constructor(log, color, width, alpha) {
    super(log);

    this.color = color;
    this.width = width;
    this.alpha = alpha;

    this.px = null;
    this.py = null;

    // 線の設定
    ctx_edit.lineCap = "round";
    ctx_edit.strokeStyle = this.color.str_color;
    ctx_edit.lineWidth = this.width;
    canv_edit.style.opacity = this.alpha;

    cur_tool = ID_TOOL.pen;
  }

  // 線を引く
  line(x, y) {
    if (this.px && this.py) {
      ctx_edit.beginPath();
      ctx_edit.moveTo(this.px, this.py);
      ctx_edit.lineTo(x, y);
      ctx_edit.stroke();
      ctx_edit.closePath();
    }

    this.px = x;
    this.py = y;
  }
}

// エフェクト付きのペン
class EffectPen extends Pen {
  constructor(log, color, width, alpha) {
    super(log, color, width, alpha);

    this.img = new Image();
    this.img.src = "./assets/pen/brush.png";
    this.interval = 3; // テクスチャの間隔

    cur_tool = ID_TOOL.effpen;
  }

  // 線を引く
  line(x, y) {
    ctx_edit.drawImage(this.img, x - this.width / 2, y - this.width / 2, this.width, this.width);

    if (this.px && this.py) {
      // 線の方向
      let dir_x = (x - this.px);
      let dir_y = (y - this.py);

      // 間隔
      let dist = Math.sqrt(Math.pow(dir_x, 2) + Math.pow(dir_y, 2));

      let cx = this.px;
      let cy = this.py;

      // 始点と終点の位置関係によって終了条件を変える
      while ((cx - x) * dir_x < 0 || (cy - y) * dir_y < 0) {
        ctx_edit.drawImage(this.img, cx - this.width / 2, cy - this.width / 2, this.width, this.width);

        cx += (x - this.px) / dist * this.interval;
        cy += (y - this.py) / dist * this.interval;
      }
    }

    this.px = x;
    this.py = y;
  }
}

// 消しゴム
class Eraser extends DrawObject {
  constructor(log, width) {
    super(log);

    this.width = width;
    this.px = null;
    this.py = null;

    ctx_main.lineCap = "round";
    ctx_main.lineWidth = this.width;

    cur_tool = ID_TOOL.eraser;
  }

  // 線を引く
  line(x, y) {
    if (this.px && this.py) {
      ctx_main.globalCompositeOperation = "destination-out";
      ctx_main.beginPath();
      ctx_main.moveTo(this.px, this.py);
      ctx_main.lineTo(x, y);
      ctx_main.stroke();
      ctx_main.closePath();
      ctx_main.globalCompositeOperation = "source-over";
    }

    this.px = x;
    this.py = y;
  }
}
