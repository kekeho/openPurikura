class DrawObject {
  constructor(target) {
    this.target = target;
    this.tctx = this.target.getContext("2d");

    // 編集用キャンバス作成
    this.editor = document.createElement("canvas");
    this.editor.id = "editCanvas";
    this.editor.width = this.target.width;
    this.editor.height = this.targer.height;
    this.ectx = this.editor.getContext("2d");
    
    // キャンバスをスクリーン上に追加
    this.canvasBox = document.getElementById("canvas-box");
    this.canvasBox.appendChild(this.canvas);
  }

  // キャンセル
  cancel() {
    this.canvasBox.removechild(this.editor);
  }

  // 配置決定
  apply() {
    this.tctx.drawImage(this.editor, 0, 0);
    this.canvasBox.removechild(this.editor);
  }
}
