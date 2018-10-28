// 静的変数
let editing = false;
const ID_TOOL = {
  pen    : 0,
  effpen : 1,
  eraser : 2,
  stamp  : 3,
  text   : 4
};
let cur_tool = ID_TOOL.pen;

class DrawObject {
  constructor(editor, log) {
    this.editor = editor;
    this.log = log;

    if (editing)
      this.editor.commit(this.log);

    editing = true;
  }

  // 編集中かどうか
  static isEditing() {
    return editing;
  }

  // 現在のツール
  static getTool() {
    return cur_tool;
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
