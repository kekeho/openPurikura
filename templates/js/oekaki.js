let modeName = {
  waiting:0,
  drawing:1,
  stanping:2,
  el_se:3
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

let canvas;
let imageCanvas;
let ctx;
let ictx;
let canvasLog;
let cc;

let penX;
let penY;

let pColor;
let pWidth;

//作業モード初期値はペン
let workMode;

//作業モードボタンのdom
let pen;
let era;
let sta;

//編集する画像
let img;

//書き中か
let drwaing;

function init(){
//ログ用のキャンバスを保存する配列
  canvasInit();
  userInit();

  pen = document.getElementById('pencil');
  era = document.getElementById('eraser');
  sta = document.getElementById('cstanp');

  //マウスが動いている時
  canvas.addEventListener('mousemove', onMove, false);
  //マウスが押されている時
  canvas.addEventListener('mousedown', onClick, false);
  //マウスが上がったとき
  canvas.addEventListener('mouseup', drawEnd, false);
  //マウスが外れたとき
  canvas.addEventListener('mouseout', drawEnd, false);

  workMode = modeName.drawing;
}

function userInit(){
  penX = "";
  penY = "";
  workMode = modeName.drawing;

  pColor = new PenColor(0, 0, 0);
  pWidth = penWidth.w3;

  drawing = false;
}

//キャンバスについての初期化関数
function canvasInit(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  imageCanvas = document.getElementById('imageCanvas');
  ictx = imageCanvas.getContext('2d');

  img = new Image();
  img.src = "js/assets/demo2.jpg";
  img.onload = function() {
    ictx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  canvasLog = new CLog();
  canvasLog.top = 0;
  canvasLog.master = 0;
  canvasLog.log.push(canvas);
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

  const logScreen = document.createElement('canvas');//キャッシュ用のキャンバスを用意
  logScreen.width = canvas.width;
  logScreen.height = canvas.height;
  const logCtx = logScreen.getContext('2d');
  logCtx.drawImage(canvas, 0, 0);//キャッシュ用のキャンバスに書き中のキャンバスをコピー
  canvasLog.log.push(logScreen);
  canvasLog.top++;
  canvasLog.master++;
  //alert(canvasLog.top);
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

function editPicture(e){
  switch (workMode){
    case modeName.drawing:
      drawLine(e);
      break;
    case modeName.stanping:
      stanpItem(e);
      break;
    default:

  }
}

//ペンモードでドラッグ
function onMove(e) {
  if(e.buttons === 1 || e.width === 1) {
    const rect = e.target.getBoundingClientRect();
    const before_x = ~~(e.clientX - rect.left);
    const before_y = ~~(e.clientY - rect.top);

    drawLine(before_x, before_y);
  }
}

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

function changeLineWidth(lineWidth){
  switch (lineWidth) {
    case 2:
      pColor.r = 255;
      pColor.g = 0;
      pColor.b = 0;
      break;
    default:
  }
}

function tool(toolNum){
  if (toolNum == 1){// クリックされボタンが鉛筆だったら
    ctx.globalCompositeOperation = 'source-over';
    pen.className = 'active';
    era.className = '';
    sta.className = '';
  }
  else if (toolNum == 2){// クリックされボタンが消しゴムだったら
    ctx.globalCompositeOperation = 'destination-out';
    pen.className = '';
    era.className = 'active';
    sta.className = '';
  }

  else if (toolNum == 3){
    ctx.globalCompositeOperation = 'source-over';
    pen.className = '';
    era.className = '';
    sta.className = 'active';
  }
}

function changeColor(colorID){
  switch (colorID) {
    case penColor.red:
      pColor.r = 255;
      pColor.b = 0;
      pColor.g = 0;
      break;
    case penColor.blue:
      stroke(0, 0, 255);
      break;
    case penColor.green:
      stroke(0,255,0);
      break;
    case penColor.black:
      stroke(50);
      break;
    case penColor.white:
      stroke(255);
      break;
    case penColor.deepblue:
      stroke(0, 113, 176);
      break;
    case penColor.deepred:
      stroke(193, 39, 45);
      break;
    case penColor.gray:
      stroke(128, 128, 128);
      break;
    case penColor.vividblue:
      stroke(0, 255, 255);
      break;
    case penColor.lightblue:
      stroke(50, 200, 255);
      break;
    case penColor.vividgreen:
      stroke(217, 224, 33);
      break;
    case penColor.lightgreen:
      stroke(214, 255, 0);
      break;
    case penColor.orange:
      stroke(247, 147, 30);
      break;
    case penColor.beige:
      stroke(198, 156, 109);
      break;
    case penColor.pink:
      stroke(255, 0, 255);
      break;
    case penColor.salmonpink:
      stroke(237, 30, 121);
      break;
    case penColor.vividorange:
      stroke(251, 176, 59);
      break;
    default:
      if (ctx != 1) {
        ctx = 1
        workMode = modeName.waiting;
      }else{
        workMode = modeName.drawing;
        ctx = 0;
      }
      eraser(ctx);
  }
}

function PenColor(red, green, blue){
  this.r = red;
  this.g = green;
  this.b = blue;
}

function back(){
  ctx.drawImage()
}

function CLog(){
  this.top = 0;
  this.master = 0;
  this.log = [];
}
