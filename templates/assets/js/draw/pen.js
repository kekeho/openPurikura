class Pen extends DrawObject {
  constructor(target) {
    this.px = null;
    this.py = null;

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

  line(x, y) {
    if (px) {
      this.ectx.beginPath();
      this.ectx.moveTo(this.px, this.py);
      this.ectx.lineTo(x, y);
      this.ectx.closePath();
      this.ectx.stroke();
    }

    this.px = x;
    this.py = y;
  }
}
