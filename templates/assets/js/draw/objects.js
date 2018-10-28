class DrawObject {
  constructor(editor) {
    if (super.editing)
      editor.commit();

    this.editor = editor;
    super.editing = true;
  }

  // 編集中かどうか
  static isEditing() {
    return super.editing;
  }

  // キャンセル
  cancel() {
    this.editor.clear();
    super.editing = false;
  }

  // 配置決定
  apply() {
    this.editor.commit();
    super.editing = false;
  }
}

// ノーマルなペン
class Pen extends DrawObject {
  constructor(editor) {
    super(editor);

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