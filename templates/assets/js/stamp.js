function loadStamp() {
  stampImg = new Image();
  stampImg.src = "js/assets/stamp/stamp.png";
}

function Stamp(img, x, y) {
  this.img = img;
  this.w = img.width;
  this.h = img.height;
  this.x = x;
  this.y = y;

  this.canvas = document.createElement("canvas");
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;
  document.getElementById("stamp-box").appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.ctx.drawImage(this.img, this.x, this.y);

  workMode = modeName.stamping;

  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.clearRext(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, this.x, this.y);
  }
}
