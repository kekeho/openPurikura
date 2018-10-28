// ノーマルなペン
class Pen extends DrawObject {
  constructor(editor, log) {
    super(editor, log);

    cur_tool = ID_TOOL.pen;
    this.px = null;
    this.py = null;
  }

  line(x, y) {
    if (this.px && this.py) {
      this.editor.ctx_edit.beginPath();
      this.editor.ctx_edit.moveTo(this.px, this.py);
      this.editor.ctx_edit.lineTo(x, y);
      this.editor.ctx_edit.closePath();
      this.editor.ctx_edit.stroke();
    }

    this.px = x;
    this.py = y;
  }
}

// エフェクト付きのペン
class EffectPen extends Pen {
  constructor(editor, log) {
    super(editor, log);

    cur_tool = ID_TOOL.effpen;
    this.img = new Image();
    this.img.src = "./assets/pen/brush.png";
  }

  point(x, y) {
    this.editor.ctx_edit.drawImage(this.img, x - this.img.width / 2, y - this.img.height / 2);
  }
}
