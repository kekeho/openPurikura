//文字列の取得
function loadText(){
  return input_text = textField.value;
}

function Text(text, x, y, fontsize, fontWeight){
  this.text = text;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.count = tc++;
  this.fontsize = fontsize;
  this.fontWeight = fontWeight;

  //編集用のキャンバス
  this.canvas = document.createElement("canvas");
  this.canvas.id = "editCanvas" ;//+ this.count;
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;

  //キャンバスをスクリーン上に追加
  this.textBox = document.getElementById("canvas-box");
  this.textBox.appendChild(this.canvas);
  
  this.ctx = this.canvas.getContext('2d');
  this.ctx.font = 'ヒラギノ角ゴシック','Hiragino Sans';
//  this.ctx.font = this.fontWeight + " 'ヒラギノ角ゴシック'",this.fontWeight + " "'Hiragino Sans'";
  
  //モード変更
  workMode = modeName.txediting;

  console.log("aaa");
  //リサイズ
  this.resize = function (newSize){
    this.fontsize = newSize;
    this.move(this.x, this.y);
  }
  
  //伊藤...
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.fillStyle = "rgb("  + pColor.r + "," + pColor.g + "," + pColor.b + ")";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = 'ヒラギノ角ゴシック','Hiragino Sans';
    this.ctx.textAlign = "center";
    this.ctx.font = this.fontsize + "px serif";

    //this.ctx.translate(this.x, this.y);
    this.ctx.fillText(this.text, this.x, this.y);
  }

  //回転操作　wayに応じて回転方向を変える
  this.spin = function(way) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.rotate(1 * 10 * Math.PI/180);
    this.ctx.translate(1, 1);
    this.ctx.font = this.fontsize + " 'ヒラギノ角ゴシック','Hiragino Sans'";
    this.ctx.strokeStyle = "blue";
    this.ctx.strokeRect(-25, -25, 50, 50);
    // this.ctx.fillText(this.text, 0, 0);
    // this.ctx.rotate(-(this.angle) * 10 * Math.PI/180);
    // this.ctx.translate(-this.x, -this.y);
    
    console.log(this.angle);
    createCache();
  }

  //配置キャンセル
  this.cancel = function(){
    this.textBox.removeChild(this.canvas);
    workMode = modeName.drawing;
  }

  //配置決定
  this.apply = function() {
    ctx.drawImage(this.canvas, 0, 0);
    createCache();
    this.cancel();
  }

}

function txResize(_scale) {
  text.resize(text.fontsize * _scale);
}