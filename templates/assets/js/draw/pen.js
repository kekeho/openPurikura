"use strict";

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

// ブラシ
class Brush extends DrawObject {
  constructor(log, color, width, alpha, interval) {
    super(log);

    this.color = color;
    this.width = width;
    this.alpha = alpha;
    this.interval = interval;

    this.px = null;
    this.py = null;
    this.cur_dist = interval;

    // 透明度の設定
    ctx_edit.globalAlpha = this.alpha;

    // テクスチャを読み込み
    this.img = new Image();
    this.img.src = "./assets/brush/brush.png";

    cur_tool = ID_TOOL.brush;
  }

  // 線を引く
  line(x, y) {
    if (!this.px || !this.py) {
      this.px = x;
      this.py = y;
    }

    // 線の方向
    let dir_x = (x - this.px);
    let dir_y = (y - this.py);

    // 間隔
    let dist = Math.sqrt(Math.pow(dir_x, 2) + Math.pow(dir_y, 2));

    if (this.cur_dist + dist >= this.interval) {
      let cx = this.px + dir_x / dist * (this.interval - this.cur_dist);
      let cy = this.py + dir_y / dist * (this.interval - this.cur_dist);

      // 始点と終点の位置関係によって終了条件を変える
      while ((cx - x) * dir_x <= 0 && (cy - y) * dir_y <= 0) {
        // ランダムに回転しながら描画
        ctx_edit.save();
        ctx_edit.translate(cx, cy);
        ctx_edit.rotate(Math.random() * 2 * Math.PI);
        ctx_edit.translate(-cx, -cy);
        ctx_edit.drawImage(this.img, cx - this.width / 2, cy - this.width / 2, this.width, this.width);
        ctx_edit.restore();

        cx += dir_x / dist * this.interval;
        cy += dir_y / dist * this.interval;
      }
    }

    this.cur_dist = (this.cur_dist + dist) % this.interval;

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
