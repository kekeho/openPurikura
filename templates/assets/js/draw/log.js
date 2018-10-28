class Log {
  constructor(canvas){
    this.target = canvas;
    this.current = 0;
    this.length = 0;
    this.log = [];
    this.createLog();
  }

  // currentにログ作成
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
    this.length = this.current;
    this.createLog();
  }

  /*
  // check that taeget can redo
  can_redo() {
    return (this.current < this.length);
  }

  // check that taeget can undo
  can_undo() {
    return (this.current > 0);
  }
  */

  // redo
  redo() {
    if (this.current < this.length) {
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
