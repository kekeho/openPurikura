class Log {
  constructor(canvas){
    this.target = canvas;
    this.current = 0;
    this.log = [];
    this.createLog();
  }

  // currectにログ作成
  createLog() {
    // create a <canvas> for log
    this.log[this.current] = document.createElement("canvas");
    this.log[this.current].width  = this.target.width;
    this.log[this.current].height = this.target.height;

    // copy to canvas_log
    let ctx_log = this.log[this.current].getContext("2d");
    ctx_log.drawImage(this.target, 0, 0);
  }

  // add log
  add() {
    this.current++;
    this.createLog();

    // clear log
    if (this.current > this.log.length - 1)
      this.log.length = this.current + 1;
  }

  /*
  // check that taeget can redo
  can_redo(){
    (this.current < this.log.length - 1) ? true : false;
  }

  // check that taeget can undo
  can_undo(){
    (this.current > 0) ? true : false;
  }
  */

  // redo
  redo() {
    if (this.current < this.log.length - 1) {
      this.current++;

      let ctx_target = this.target.getContext("2d");
      ctx_target.globalCompositeOperation = "source-over";
      ctx_target.clearRect(0, 0, this.target.width, this.target.height);
      ctx_target.drawImage(this.log[this.current], 0, 0);

      return true;
    }
    return false;
  }

  // undo
  undo() {
    if (DrawObject.isEditing()) {
      switch (tool) {
        case ID_TOOL.pen:
          pen.apply();
          break;
      }
    }

    if (this.current > 0) {
      this.current--;

      let ctx_target = this.target.getContext("2d");
      ctx_target.globalCompositeOperation = "source-over";
      ctx_target.clearRect(0, 0, this.target.width, this.target.height);
      ctx_target.drawImage(this.log[this.current], 0, 0);

      return true;
    }
    return false;
  }

  // return current image
  image() {
    return this.log[this.current];
  }
}
