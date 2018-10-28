const ID_TOOL = {
  pen    : 0,
  effpen : 1,
  eraser : 2,
  stamp  : 3,
  text   : 4
};

// 静的変数
let editing = false;
let cur_tool = ID_TOOL.pen;
let canv_main = null;
let canv_edit = null;
let ctx_main = null;
let ctx_edit = null;

// すべての描画オブジェクトの親クラス
class DrawObject {
  constructor(log) {
    this.log = log;

    if (editing)
      DrawObject.commit(this.log);

    canv_edit.style.opacity = 1;
    editing = true;
  }

  // 描画先キャンバスを設定
  static setCanvas(_canv_main, _canv_edit) {
    canv_main = _canv_main;
    canv_edit = _canv_edit;
    ctx_main = canv_main.getContext("2d");
    ctx_edit = canv_edit.getContext("2d");
  }

  // 編集中かどうか
  static isEditing() {
    return editing;
  }

  // 現在のツール
  static getTool() {
    return cur_tool;
  }

  // メインキャンバスに統合
  static commit(log) {
    // 透明度を設定
    ctx_main.globalAlpha = canv_edit.style.opacity;
    ctx_main.drawImage(canv_edit, 0, 0);
    ctx_main.globalAlpha = 1;

    log.add();
    ctx_edit.clearRect(0, 0, canv_edit.width, canv_edit.height);
  }

  // 配置決定
  apply() {
    DrawObject.commit(this.log);
    editing = false;
  }
}
