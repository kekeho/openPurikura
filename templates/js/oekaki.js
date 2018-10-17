let modeName = {
  waiting:0,
  drawing:1,
  stanping:2,
};

let penColor = {
  red  : 1,
  blue : 2,
  green: 3,
  pink : 4,
  lightblue: 5,
  lightgreen: 6,
  black: 7,
  white: 8,
  deepred: 9,
  salmonpink: 10,
  yellow: 11,
  vividgreen: 12,
  orange: 13,
  vividorange: 14,
  vividblue: 15,
  deepblue: 16,
  gray: 17,
  beige: 18,

};

let penWidth = {
  w1:  1,
  w2:  3,
  w3:  5,
  w4:  7,
  w5:  8,
  w6:  9,
  w7: 11,
  w8: 13,
  w9: 15
};

//キャンバス関係
let canvas;
let imageCanvas;
let ctx;
let ictx;
let canvasLog;

//ペンの一フレーム？前の座標
let penX;
let penY;

//ペンの色と太さ
let pColor;
let pWidth;

//作業モード初期値はペン
let workMode;

//作業モードボタンのdom
let pen_button;
let era_button;
let sta_button;

//戻る、進むボタンのdom
let back_button;
let next_button;

//編集する画像
let img;
let pic;
let pic_num = 3;

//書き中か
let drwaing;

function init(){
//ログ用のキャンバスを保存する配列
  canvasInit();
  logStart();
  userInit();
  buttonInit();

  eventInit();
}

function buttonInit(){
  //drawingモード中の作業モードボタン
  pen_button = document.getElementById('pencil');
  era_button = document.getElementById('eraser');
  sta_button = document.getElementById('stanp');

  //戻る進むボタン
  // back_button = document.getElementById('back_butt');
  // next_button = document.getElementById('next_butt');

  //セーブボタン
  //save_button = document.getElementById('save_butt');
}

function eventInit(){
  //次へボタンと戻るボタン
  // back_button.addEventListener('mousedown', back, false);
  // next_button.addEventListener('mousedown', next, false);

  //セーブボタン
  //save_button.addEventListener('mousedown', savePictures, false);

  //マウスが動いている時
  canvas.addEventListener('mousemove', onMove, false);
  canvas.addEventListener('mousedown', onClick, false);
  canvas.addEventListener('mouseup', drawEnd, false);
  canvas.addEventListener('mouseout', drawEnd, false);
}

function userInit(){
  penX = "";
  penY = "";
  workMode = modeName.drawing;

  pColor = new PenColor(0, 0, 0);
  pWidth = penWidth.w3;

  drawing = false;
}

//キャンバスについて、編集する画像の初期化関数
function canvasInit(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  imageCanvas = document.getElementById('imageCanvas');
  ictx = imageCanvas.getContext('2d');

  //使用する3枚の画像
  pic = [];
  pic[0] = new Image();
  pic[0].src = "./assets/picture1.png";
  pic[1] = new Image();
  pic[1].src = "./assets/picture2.png";
  pic[2] = new Image();
  pic[2].src = "./assets/picture3.png";

  img = pic[0];
  img.onload = function() {
    ictx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}


function CLog(){
  this.top = 0;
  this.current = 0;
  this.log = [];
}

function logStart(){
  canvasLog = new CLog();
  canvasLog.top = 0;
  canvasLog.current = 0;
  canvasLog.log.push(canvas);
}

function back(){
  if (canvasLog.current <= 0) {
    alert("保存されている最古のscreenです");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog.log[--canvasLog.current], 0, 0);
}

function next(){

  if (canvasLog.current >= canvasLog.top) {
    alert("保存されている最新のscreenです");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog.log[++canvasLog.current], 0, 0);
}

//ペンがキャンバスの外に出たとき、浮いたときに線をやめて
function drawEnd() {
  if (!drawing) {
    penX = "";
    penY = "";
    drawing = false;
    return;
  }

  drawing = false;
  penX = "";
  penY = "";

  createCache();
}

function createCache(){
  //キャッシュ用のキャンバスを用意
  const logScreen = document.createElement('canvas');
  logScreen.width = canvas.width;
  logScreen.height = canvas.height;
  const logCtx = logScreen.getContext('2d');
  //キャッシュ用のキャンバスに書き中のキャンバスをコピー
  logCtx.drawImage(canvas, 0, 0);
  canvasLog.top++;
  canvasLog.current++;
  canvasLog.log[canvasLog.current] = logScreen;//履歴配列に保存
  if (canvasLog.current != canvasLog.top) {
    canvasLog.top = canvasLog.current;
  }
}

//ペンモードでタッチ
function onClick(e){
  if (e.button === 0) {
    const rect = e.target.getBoundingClientRect();
    const before_x = ~~(e.clientX - rect.left);
    const before_y = ~~(e.clientY - rect.top);

    drawing = true;
    //drawLineにマウスの位置を渡す
    drawLine(before_x, before_y);
  }
}

//ペンモードでドラッグ
function onMove(e) {
  //現在の作業モードに応じて処理を変える
  switch (workMode){
    case modeName.drawing:
      //マウスが押されているなら描画処理に入る
      if(e.buttons === 1 || e.width === 1) {
        const rect = e.target.getBoundingClientRect();
        const before_x = ~~(e.clientX - rect.left);
        const before_y = ~~(e.clientY - rect.top);

        drawLine(before_x, before_y);
      }
      break;
    case modeName.stanping:
      break;
    default:

  }
}

//線を引く関数。ペンで描くときの
function drawLine(X, Y){
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgb('+ pColor.r + ',' + pColor.g + ',' + pColor.b + ')';
  ctx.lineWidth = pWidth;

  ctx.beginPath();
  if (penX === "") {
    ctx.moveTo(X, Y);
  }else {
    ctx.moveTo(penX, penY);
  }

  ctx.lineTo(X, Y);
  ctx.stroke();
  ctx.closePath();

  penX = X;
  penY = Y;
}

//ペンの太さを変える関数
function changeLineWidth(lineWidth){
  pWidth = lineWidth;
}

//ペン、消しゴム、スタンプのモードを切り替える関数
function tool(toolNum){
  if (toolNum == 1){// クリックされボタンが鉛筆だったら
    ctx.globalCompositeOperation = 'source-over';
    pen_button.className = 'active';
    era_button.className = '';
    sta_button.className = '';
  }
  else if (toolNum == 2){// クリックされボタンが消しゴムだったら
    ctx.globalCompositeOperation = 'destination-out';
    pen_button.className = '';
    era_button.className = 'active';
    sta_button.className = '';
  }

  else if (toolNum == 3){
    ctx.globalCompositeOperation = 'source-over';
    pen_button.className = '';
    era_button.className = '';
    sta_button.className = 'active';
  }
}

//色を変える関数　まだ二色足りない
function changeColor(colorID){
  switch (colorID) {
    case penColor.red:
      pColor.r = 255;
      pColor.b = 0;
      pColor.g = 0;
      break;
    case penColor.blue:
      penColor.r = 0;
      penColor.g = 0;
      penColor.b = 255;
      break;
    case penColor.green:
      penColor.r = 0;
      penColor.g = 255;
      penColor.b = 0;
      break;
    case penColor.black:
      penColor.r = 50;
      penColor.g = 50;
      penColor.b = 50;
      break;
    case penColor.white:
      penColor.r = 255;
      penColor.g = 255;
      penColor.b = 255;
      break;
    case penColor.deepblue:
      penColor.r = 0;
      penColor.g = 113;
      penColor.b = 176;
      break;
    case penColor.deepred:
      penColor.r = 193;
      penColor.g = 39;
      penColor.b = 45;
      break;
    case penColor.gray:
      penColor.r = 128;
      penColor.g = 128;
      penColor.b = 128;
      break;
    case penColor.vividblue:
      penColor.r = 0;
      penColor.g = 255;
      penColor.b = 255;
      break;
    case penColor.lightblue:
      penColor.r = 50;
      penColor.g = 200;
      penColor.b = 255;
      break;
    case penColor.vividgreen:
      penColor.r = 217;
      penColor.g = 224;
      penColor.b = 33;
      break;
    case penColor.lightgreen:
      penColor.r = 214;
      penColor.g = 255;
      penColor.b = 0;
      break;
    case penColor.orange:
      penColor.r = 247;
      penColor.g = 147;
      penColor.b = 30;
      break;
    case penColor.beige:
      penColor.r = 198;
      penColor.g = 156;
      penColor.b = 109;
      break;
    case penColor.pink:
      penColor.r = 255;
      penColor.g = 0;
      penColor.b = 255;
      break;
    case penColor.salmonpink:
      penColor.r = 237;
      penColor.g = 30;
      penColor.b = 121;
      break;
    case penColor.vividorange:
      penColor.r = 251;
      penColor.g = 176;
      penColor.b = 59;
      break;
    default:
  }
}

//編集する画像を切り替える
function changePic(num){
  img = pic[num-1];
  ictx.clearRect(0, 0, canvas.width, canvas.height);
  ictx.drawImage(img, 0, 0, canvas.width, canvas.height);


}

//最後の完成写真を合成して保存する関数
function savePictures(){

}

function PenColor(red, green, blue){
  this.r = red;
  this.g = green;
  this.b = blue;
}
