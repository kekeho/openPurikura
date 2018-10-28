// ノーマルなペン
class Pen extends DrawObject {
  constructor(editor, log, width, alpha) {
    super(editor, log);

    this.width = width;
    this.alpha = alpha;
    this.px = null;
    this.py = null;

    this.editor.ctx_edit.lineCap = "round";
    this.editor.ctx_edit.lineWidth = this.width;
    this.editor.ctx_edit.globalAlpha = this.alpha;

    cur_tool = ID_TOOL.pen;
  }

  line(x, y) {
    if (this.px && this.py) {
      this.editor.ctx_edit.beginPath();
      this.editor.ctx_edit.moveTo(this.px, this.py);
      this.editor.ctx_edit.lineTo(x, y);
      this.editor.ctx_edit.stroke();
      this.editor.ctx_edit.closePath();
    }

    this.px = x;
    this.py = y;
  }
}

// エフェクト付きのペン
class EffectPen extends Pen {
  constructor(editor, log, width, alpha) {
    super(editor, log, width, alpha);

    this.img = new Image();
    this.img.src = "./assets/pen/brush.png";
    this.interval = 3; // テクスチャの間隔

    cur_tool = ID_TOOL.effpen;
  }

  line(x, y) {
    this.editor.ctx_edit.drawImage(this.img, x - this.width / 2, y - this.width / 2, this.width, this.width);

    if (this.px && this.py) {
      // 線の方向
      let dir_x = (x - this.px);
      let dir_y = (y - this.py);

      // 間隔
      let dist = Math.sqrt(Math.pow(dir_x, 2) + Math.pow(dir_y, 2));

      let cx = this.px;
      let cy = this.py;

      while ((cx - x) * dir_x < 0 || (cy - y) * dir_y < 0) {
        this.editor.ctx_edit.drawImage(this.img, cx - this.width / 2, cy - this.width / 2, this.width, this.width);

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
  constructor(editor, log, width) {
    super(editor, log);

    this.width = width;
    this.px = null;
    this.py = null;

    cur_tool = ID_TOOL.eraser;
  }

  line(x, y) {
    if (this.px && this.py) {
      this.editor.ctx_main.globalCompositeOperation = "destination-out";
      this.editor.ctx_main.beginPath();
      this.editor.ctx_main.moveTo(this.px, this.py);
      this.editor.ctx_main.lineTo(x, y);
      this.editor.ctx_main.closePath();
      this.editor.ctx_main.stroke();
      this.editor.ctx_main.globalCompositeOperation = "source-over";
    }

    this.px = x;
    this.py = y;
  }
}
