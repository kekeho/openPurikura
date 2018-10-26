class Log {
  constructor(canvas){
    this.target = canvas;
    this.current = 0;
    this.log     = [];
  }

  // add log
  add(){
    // create a <canvas> for log
    let canvas_log = document.createElement("canvas");
    canvas_log.width  = this.target.width;
    canvas_log.height = this.target.height;
    let ctx_log = canvas_log.getContext("2d");

    // copy to canvas_log
    ctx_log.drawImage(this.target, 0, 0);
    this.current++;
    this.log[this.current];

    // clear log
    if (current != this.log.length - 1) {
      this.log.length = this.current + 1;
    }
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
  redo(){
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
  undo(){
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
  image(){
    return this.log[this.current];
  }
}
