//文字列の取得
function loadText(){
  return input_text = textField.value;
}

function Text(text, x, y, fontsize){
  this.text = text;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.count = tc++;
  this.fontsize = fontsize;

  //編集用のキャンバス
  this.canvas = document.createElement("canvas");
  this.canvas.id = "editCanvas" ;//+ this.count;
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;

  //キャンバスをスクリーン上に追加
  this.textBox = document.getElementById("canvas-box");
  this.textBox.appendChild(this.canvas);
  
  this.ctx = this.canvas.getContext('2d');
  this.ctx.font = fontsize + "px serif";
  this.ctx.textAlign = "center";
  this.ctx.fillText(this.text, this.x, this.y);
  
  //モード変更
  workMode = modeName.txediting;

  console.log("aaa");

  //伊藤...リサイズも含む
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = this.fontsize + "px serif";
    //this.ctx.translate(this.x, this.y);
    this.ctx.fillText(this.text, this.x, this.y);
  }

  //回転操作　wayに応じて回転方向を変える
  this.spin = function(way) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.rotate(1 * 10 * Math.PI/180);
    this.ctx.translate(10, 10);
    this.ctx.font = this.fontsize + "px serif";
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(-5, -5, 10, 10);
    // this.ctx.fillText(this.text, 0, 0);
    // this.ctx.rotate(-(this.angle) * 10 * Math.PI/180);
    // this.ctx.translate(-this.x, -this.y);
    
    console.log(this.angle);
    createCache();
  }

  //配置キャンセル
  this.cancel = function(){
    this.textBox.removeChild(this.canvas);
  }

  //配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }

}
