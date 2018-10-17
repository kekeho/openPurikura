let modeName = {
  waiting : 0,
  drawing : 1,
  stamping: 2
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
//お絵かきようキャンバス
let canvas;
//キャンバスのcontextの配列
let ctx;
//編集中の画像
let imageCanvas;
let ictx;
//ログ用のキャンバスを保存する配列
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
//画像三昧の配列
let pictures;
//編集中の画像の添字
let pic_num;

//書き中か
let drwaing;

function init(){
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
  //セーブボタン
  //save_button.addEventListener('mousedown', savePictures, false);

  //canvasに対するイベントリスナ
  canvas.addEventListener('mousemove', onMove, false);
  canvas.addEventListener('mousedown', onClick, false);
  canvas.addEventListener('mouseup', drawEnd, false);
  canvas.addEventListener('mouseout', drawEnd, false);
  canvas.addEventListener('touchmove', onMove, false);
  canvas.addEventListener('touchstart', onClick, false);
  canvas.addEventListener('touchend', drawEnd, false);
  canvas.addEventListener('touchchancel', drawEnd, false);
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
  pic_num = 0;

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  imageCanvas = document.getElementById('imageCanvas');
  ictx = imageCanvas.getContext('2d');

  //使用する3枚の画像
  pictures = [];
  pictures[0] = new Image();
  pictures[0].src = "./assets/picture1.png";
  pictures[1] = new Image();
  pictures[1].src = "./assets/picture2.png";
  pictures[2] = new Image();
  pictures[2].src = "./assets/picture3.png";

  img = pictures[pic_num];
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
  canvasLog = [];
  for (let i = 0; i<3; i++){
    canvasLog[i] = new CLog();
    canvasLog[i].top = 0;
    canvasLog[i].current = 0;
    canvasLog[i].log.push(canvas);
  }
}

function back(){
  if (canvasLog[pic_num].current <= 0) {
    //alert("保存されている最古のscreenです");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[--canvasLog[pic_num].current], 0, 0);
}

function next(){
  if (canvasLog[pic_num].current >= canvasLog[pic_num].top) {
    //alert("保存されている最新のscreenです");
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[++canvasLog[pic_num].current], 0, 0);
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
  canvasLog[pic_num].top++;
  canvasLog[pic_num].current++;
  canvasLog[pic_num].log[canvasLog[pic_num].current] = logScreen;//履歴配列に保存
  if (canvasLog[pic_num].current != canvasLog[pic_num].top) {
    canvasLog[pic_num].top = canvasLog[pic_num].current;
  }
}

//編集する画像を切り替える
function switchPic(num){
  createCache();
  canvasLog[pic_num].top--;
  canvasLog[pic_num].current--;

  pic_num = num - 1;

  img = pictures[pic_num];
  ictx.clearRect(0, 0, canvas.width, canvas.height);
  ictx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const nextCanvas = canvasLog[pic_num].log[canvasLog[pic_num].current];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(nextCanvas, 0, 0);
}

//ペンモードでタッチ
function onClick(e){
  e.preventDefault();
  if (e.touches) {
    const rect = e.target.getBoundingClientRect();
    const before_x = ~~(e.touches[0].clientX - rect.left);
    const before_y = ~~(e.touches[0].clientY - rect.top);

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
      e.preventDefault();
      if(e.touches || e.width === 1) {
        const rect = e.target.getBoundingClientRect();
        const before_x = ~~(e.touches[0].clientX - rect.left);
        const before_y = ~~(e.touches[0].clientY - rect.top);

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
    workMode = modeName.drawing;
  }
  else if (toolNum == 2){// クリックされボタンが消しゴムだったら
    ctx.globalCompositeOperation = 'destination-out';
    pen_button.className = '';
    era_button.className = 'active';
    workMode = modeName.drawing;
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
      pColor.r = 0;
      pColor.g = 0;
      pColor.b = 255;
      break;
    case penColor.green:
      pColor.r = 0;
      pColor.g = 255;
      pColor.b = 0;
      break;
    case penColor.black:
      pColor.r = 50;
      pColor.g = 50;
      pColor.b = 50;
      break;
    case penColor.white:
      pColor.r = 255;
      pColor.g = 255;
      pColor.b = 255;
      break;
    case penColor.deepblue:
      pColor.r = 0;
      pColor.g = 113;
      pColor.b = 176;
      break;
    case penColor.deepred:
      pColor.r = 193;
      pColor.g = 39;
      pColor.b = 45;
      break;
    case penColor.gray:
      pColor.r = 128;
      pColor.g = 128;
      pColor.b = 128;
      break;
    case penColor.vividblue:
      pColor.r = 0;
      pColor.g = 255;
      pColor.b = 255;
      break;
    case penColor.lightblue:
      pColor.r = 50;
      pColor.g = 200;
      pColor.b = 255;
      break;
    case penColor.vividgreen:
      pColor.r = 217;
      pColor.g = 224;
      pColor.b = 33;
      break;
    case penColor.lightgreen:
      pColor.r = 214;
      pColor.g = 255;
      pColor.b = 0;
      break;
    case penColor.orange:
      pColor.r = 247;
      pColor.g = 147;
      pColor.b = 30;
      break;
    case penColor.beige:
      pColor.r = 198;
      pColor.g = 156;
      pColor.b = 109;
      break;
    case penColor.pink:
      pColor.r = 255;
      pColor.g = 0;
      pColor.b = 255;
      break;
    case penColor.salmonpink:
      pColor.r = 237;
      pColor.g = 30;
      pColor.b = 121;
      break;
    case penColor.vividorange:
      pColor.r = 251;
      pColor.g = 176;
      pColor.b = 59;
      break;
    default:
  }
}

//最後の完成写真を合成して保存する関数
function savePictures(){

}

function PenColor(red, green, blue){
  this.r = red;
  this.g = green;
  this.b = blue;
}
