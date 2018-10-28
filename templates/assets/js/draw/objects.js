// 静的変数
let editing = false;

class DrawObject {
  constructor(editor, log) {
    this.editor = editor;
    this.log = log;

    if (editing) {
      this.editor.commit(this.log);
    }

    editing = true;
  }

  // 編集中かどうか
  static isEditing() {
    return editing;
  }

  // キャンセル
  cancel() {
    this.editor.clear();
    editing = false;
  }

  // 配置決定
  apply() {
    this.editor.commit(this.log);
    editing = false;
  }
}

// ノーマルなペン
class Pen extends DrawObject {
  constructor(editor, log) {
    super(editor, log);

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