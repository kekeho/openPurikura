function loadStamp() {
  stampImg = new Image();
  stampImg.src = "js/assets/stamp/stamp.png";
}

function Stamp(img) {
  this.img = img;
  this.w = img.width;
  this.h = img.height;
  this.x = canvas.width / 2 - img.width / 2;
  this.y = canvas.height / 2 - img.height / 2;

  this.canvas = document.createElement("canvas");
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;
  document.getElementById("stamp-box").appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");
  this.ctx.drawImage(this.img, this.x, this.y);
}
