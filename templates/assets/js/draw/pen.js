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
    if (!this.px || !this.py) {
      this.px = x;
      this.py = y;
    }

    ctx_edit.beginPath();
    ctx_edit.moveTo(this.px, this.py);
    ctx_edit.lineTo(x, y);
    ctx_edit.stroke();
    ctx_edit.closePath();

    this.px = x;
    this.py = y;
  }
}

// 縁付きペン
class EdgePen extends DrawObject {
  constructor(log, color_back, color_front, width, alpha) {
    super(log);

    this.color_back = color_back;
    this.color_front = color_front;
    this.width = width;
    this.alpha = alpha;

    this.px = null;
    this.py = null;

    // 線の設定
    ctx_edit.lineCap = "round";
    canv_edit.style.opacity = this.alpha;

    cur_tool = ID_TOOL.edgepen;
  }

  // 線を引く
  line(x, y) {
    if (!this.px || !this.py) {
      this.px = x;
      this.py = y;
    }

    ctx_edit.beginPath();

    ctx_edit.strokeStyle = this.color_back.str_color;
    ctx_edit.lineWidth = this.width;
    ctx_edit.globalCompositeOperation = "destination-over";

    ctx_edit.moveTo(this.px, this.py);
    ctx_edit.lineTo(x, y);
    ctx_edit.stroke();

    ctx_edit.strokeStyle = this.color_front.str_color;
    ctx_edit.lineWidth = this.width / 3;
    ctx_edit.globalCompositeOperation = "source-over";

    ctx_edit.moveTo(this.px, this.py);
    ctx_edit.lineTo(x, y);
    ctx_edit.stroke();

    ctx_edit.closePath();

    this.px = x;
    this.py = y;
  }
}

// ブラシ
class Brush extends DrawObject {
  constructor(log, color, width, num, interval) {
    super(log);
    let _this = this;

    this.color = color;
    this.width = width;
    this.num = num;
    this.interval = interval;

    this.px = null;
    this.py = null;
    this.cur_dist = 0;

    // テクスチャを読み込み
    this.img = new Image();
    this.img.src = "./assets/brush/" + this.num + "/" + this.color.id + ".png";

    cur_tool = ID_TOOL.brush;
  }

  // 点を打つ
  point(x, y) {
    // ランダムに回転して描画
    ctx_edit.save();
    ctx_edit.translate(x, y);
    ctx_edit.rotate(Math.random() * 2 * Math.PI);
    ctx_edit.translate(-x, -y);
    ctx_edit.drawImage(this.img, x - this.width / 2, y - this.width / 2, this.width, this.width);
    ctx_edit.restore();
  }

  // 線を引く
  line(x, y) {
    if (!this.px || !this.py) {
      this.point(x, y);

    } else {
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
          this.point(cx, cy);
          cx += dir_x / dist * this.interval;
          cy += dir_y / dist * this.interval;
        }
      }

      this.cur_dist = (this.cur_dist + dist) % this.interval;
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
