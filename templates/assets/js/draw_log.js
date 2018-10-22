class Log {
  constructor(canvas){
    this.canvas = canvas;
    this.current = 0;
    this.log     = [];
  }

  /* add log */
  add(){
    /* create a CANVAS for log */
    let canvas_log = document.createElement("canvas");
    canvas_log.width  = this.canvas.width;
    canvas_log.height = this.canvas.height;
    let ctx_log = canvas_log.getContext("2d");

    /* copy to canvas_log */
    ctx_log.drawImage(this.canvas, 0, 0);
    this.current++;
    this.log[this.current];

    /* clear log */
    if (current != this.log.length - 1) {
      this.log.length = this.current + 1;
    }
  }

  /* check that this can redo */
  can_redo(){
    (this.current < this.log.length - 1) ? true : false;
  }

  /* check that this can undo */
  can_undo(){
    (this.current > 0) ? true : false;
  }

  /* redo */
  redo(){
    if (this.current < this.log.length - 1) {
      this.current++;
      return log[current];
    }
    return null;
  }

  /* undo */
  undo(){
    if (this.current > 0) {
      this.current--;
      return log[current];
    }
    return null;
  }
}

