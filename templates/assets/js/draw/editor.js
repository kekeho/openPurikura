class Editor {
  constructor(canvas_main, canvas_edit){
    this.canv_main = canvas_main;
    this.ctx_main = this.canv_main.getContext("2d");

    this.canv_edit = canvas_edit;
    this.ctx_edit = this.canv_edit.getContext("2d");
  }

  // クリア
  clear() {
    this.ctx_edit.clearRect(0, 0, this.canv_edit.width, this.canv_edit.height);
    super.editing = false;
  }

  // 現在の画像をメインキャンバスに統合
  commit(log) {
    this.ctx_main.globalAlpha = this.canv_edit.style.opacity;
    this.ctx_main.drawImage(this.canv_edit, 0, 0);
    this.ctx_main.globalAlpha = 1;

    log.add();
    this.clear();
    super.editing = false;
  }
}
