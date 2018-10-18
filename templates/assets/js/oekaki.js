let modeName = {
  waiting  : 0,
  drawing  : 1,
  erasering: 2,
  stamping : 3,
  editing  : 4
};

let penColor = {
  red        : 1,
  blue       : 2,
  green      : 3,
  pink       : 4,
  lightblue  : 5,
  lightgreen : 6,
  black      : 7,
  white      : 8,
  deepred    : 9,
  salmonpink : 10,
  yellow     : 11,
  vividgreen : 12,
  orange     : 13,
  vividorange: 14,
  vividblue  : 15,
  deepblue   : 16,
  gray       : 17,
  beige      : 18
};

let penWidth = {
  w1: 1,
  w2: 3,
  w3: 5,
  w4: 7,
  w5: 8,
  w6: 9,
  w7: 11,
  w8: 13,
  w9: 15
};

/* キャンバス関係 */
// お絵かきようキャンバス
let canvas;
let ctx;

// 背景用キャンバス
let imageCanvas;
let ictx;

// イベント捕捉用キャンバス
let eventCanvas;

// ログ用のキャンバスを保存する配列
let canvasLog;

// ペンの一フレーム？前の座標
let penX;
let penY;

// 現在の座標
let x;
let y;

// ペンの色と太さ
let pColor;
let pWidth;

// 作業モード初期値はペン
let workMode;

// 作業モードボタンのDOM
let pen_button;
let era_button;
let sta_button;

// 戻る、進むボタンのDOM
let back_button;
let next_button;

// 編集する画像
let img;
// 画像三昧の配列
let pictures;
// 編集中の画像の添字
let pic_num;

//書き中か
let drawingFlag;

// onloadにより実行 
function init() {
  canvasInit();
  logStart();
  userInit();
  buttonInit();

  eventInit();
  loadStamp();
}

function buttonInit() {
  // drawingモード中の作業モードボタン
  pen_button = document.getElementById("pencil");
  era_button = document.getElementById("eraser");
  sta_button = document.getElementById("stamp");

  // セーブボタン
  //save_button = document.getElementById("save_butt");
}

function eventInit() {
  // セーブボタン
  //save_button.addEventListener("mousedown", savePictures, false);

  // PC用イベントリスナ
  eventCanvas.addEventListener("mousemove", onMove,  false);
  eventCanvas.addEventListener("mousedown", onClick, false);
  eventCanvas.addEventListener("mouseup",   drawEnd, false);
  eventCanvas.addEventListener("mouseout",  drawEnd, false);

  // iPad用イベントリスナ
  eventCanvas.addEventListener("touchmove",    onMove,  false);
  eventCanvas.addEventListener("touchstart",   onClick, false);
  eventCanvas.addEventListener("touchend",     drawEnd, false);
  eventCanvas.addEventListener("touchchancel", drawEnd, false);
}

function userInit() {
  penX = null;
  penY = null;
  workMode = modeName.drawing;

  pColor = new PenColor(0, 0, 0);
  pWidth = penWidth.w3;

  drawingFlag = false;
}

// キャンバスについて、編集する画像の初期化関数
function canvasInit() {
  pic_num = 0;

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  imageCanvas = document.getElementById("imageCanvas");
  ictx = imageCanvas.getContext("2d");
  eventCanvas = document.getElementById("eventCanvas");

  // 使用する3枚の画像
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


function CLog() {
  this.top = 0;
  this.current = 0;
  this.log = [];
}

function logStart() {
  canvasLog = [];
  for (let i = 0; i < 3; i++) {
    canvasLog[i] = new CLog();
    canvasLog[i].top = 0;
    canvasLog[i].current = 0;
    canvasLog[i].log.push(canvas);
  }
}

function back() {
  // これ以上戻れない
  if (canvasLog[pic_num].current <= 0)
    return;

  if (workMode == modeName.editing)
    return;

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[--canvasLog[pic_num].current], 0, 0);

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "destination-out";
}

function next() {
  // これ以上進めない
  if (canvasLog[pic_num].current >= canvasLog[pic_num].top)
    return;

  if (workMode == modeName.editing)
    return;

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[++canvasLog[pic_num].current], 0, 0);

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "destination-out";
}

// ペンがキャンバスの外に出たとき、浮いたときに線をやめて
function drawEnd() {
  penX = null;
  penY = null;

  switch (workMode) {
    case modeName.stamping:
    case modeName.editing:
      break;

    default:
      if (drawingFlag) {
        createCache();
        return;
      }
      break;
  }

  drawingFlag = false;
}

function createCache() {
  // キャッシュ用のキャンバスを用意
  const logScreen = document.createElement("canvas");
  logScreen.width = canvas.width;
  logScreen.height = canvas.height;

  // キャッシュ用のキャンバスに書き中のキャンバスをコピー
  const logCtx = logScreen.getContext("2d");
  logCtx.drawImage(canvas, 0, 0);
  canvasLog[pic_num].top++;
  canvasLog[pic_num].current++;
  canvasLog[pic_num].log[canvasLog[pic_num].current] = logScreen;

  if (canvasLog[pic_num].current != canvasLog[pic_num].top)
    canvasLog[pic_num].top = canvasLog[pic_num].current;
}

// 編集する画像を切り替える
function switchPic(num) {
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

// ペンモードでタッチ
function onClick(e) {
  drawingFlag = true;
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();

  // PCとiPadで座標の取得方法を変える
  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  const before_x = ~~(x);
  const before_y = ~~(y);

  switch (workMode) {
    case modeName.drawing:
    case modeName.erasering:
      drawLine(before_x, before_y);
      break;

    case modeName.stamping:
      stamp = new Stamp(stampImg, x, y, 1);
      break;

    case modeName.editing:
      stamp.move(x, y);
      break;
  }
}

// ペンモードでドラッグ
function onMove(e) {
  // マウスが押されている場合にのみ処理を実行
  if (!drawingFlag)
    return;

  e.preventDefault();
  const rect = e.target.getBoundingClientRect();

  // PCとiPadで座標の取得方法を変える
  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  // 現在の作業モードに応じて処理を変える
  switch (workMode) {
    case modeName.drawing:
    case modeName.erasering:
      const before_x = ~~(x);
      const before_y = ~~(y);

      drawLine(before_x, before_y);
      break;

    case modeName.editing:
      stamp.move(x, y);
      break;
  }
}

// 線を引く関数。ペンで描くときの
function drawLine(X, Y) {
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgb("  + pColor.r + "," + pColor.g + "," + pColor.b + ")";
  ctx.lineWidth = pWidth;

  ctx.beginPath();
  if (penX == null) {
    ctx.moveTo(X, Y);
  } else {
    ctx.moveTo(penX, penY);
  }

  ctx.lineTo(X, Y);
  ctx.stroke();
  ctx.closePath();

  penX = X;
  penY = Y;
}

// ペンの太さを変える関数
function changeLineWidth(lineWidth) {
  pWidth = lineWidth;
}

// ペン、消しゴムのモードを切り替える関数
function tool(toolNum) {
  if (workMode == modeName.editing) {
    stamp.apply();
    delete stamp;
  }

  switch (toolNum) {
    case 0: // ペンモード
      ctx.globalCompositeOperation = "source-over";
      pen_button.className = "active";
      era_button.className = "";
      sta_button.className = "";
      workMode = modeName.drawing;
      break;

    case 1: // 消しゴムモード
      ctx.globalCompositeOperation = "destination-out";
      pen_button.className = "";
      era_button.className = "active";
      sta_button.className = "";
      workMode = modeName.erasering;
      break;

    case 2: // スタンプモード
      ctx.globalCompositeOperation = "source-over";
      pen_button.className = "";
      era_button.className = "";
      sta_button.className = "active";
      workMode = modeName.stamping;
      break;
  }
}

// 色を変える関数　まだ二色足りない
function changeColor(colorID) {
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
<<<<<<< HEAD
    case penColor.yellow:
      pColor.r = 255;
      pColor.g = 255;
      pColor.b = 0;
      break;
    default:
=======
>>>>>>> b82d88453d7cac036dd1895f01e023be43fa142e
  }
}

// 最後の完成写真を合成して保存する関数
function savePictures() {

}

function PenColor(red, green, blue) {
  this.r = red;
  this.g = green;
  this.b = blue;
}
