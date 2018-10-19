//文字列の取得
function loadText(){
  return input_text = textField.value;
}

function Text(text, x, y, fontsize){
  this.text = text;
  this.x = x;
  this.y = y;
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
  // pen_button.className = '';
  // era_button.className = '';
  // sta_button.className = 'active';
  workMode = modeName.txediting;

  console.log("aaa");

  //伊藤...リサイズも含む
  this.move = function(x, y) {
    this.x = x;
    this.y = y;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = fontsize + "px serif";
    this.ctx.fillText(this.text, this.x, this.y);
  }

  this.cancel = function(){
    this.textBox.removeChild(this.canvas);
  }

  this.apply = function() {
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x, this.y);
    createCache();
    this.cancel();
  }

}
