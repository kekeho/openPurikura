let modeName = {
  waiting  : 0,
  drawing  : 1,
  erasering: 2,
  stamping : 3,
  stediting: 4,
  texting  : 5,
  txediting: 6
};

let penColor = {
  deepred    : 1,
  red        : 2,
  salmonpink : 3,
  hotpink    : 4,
  pink       : 5,

  purple     : 6,
  blue       : 7,
  deepblue   : 8,
  lightblue  : 9,
  vividblue  : 10,

  green      : 11,
  yellow     : 12,
  vividorange: 13,
  orange     : 14,
  beige      : 15,

  vividgreen : 16,
  darkgreen  : 17,
  gray       : 18,
  black      : 19,
  white      : 20,
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
//ペンの透明度
let pAlpha;

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

//右に表示されている3枚
let pic1;
let pic2;
let pic3;

//書き中か
let drawingFlag;

//テキストフィールド
let textField;
//入力されたテキスト
let input_text;
//キャンバスのid被らないためのk
let tc;

//出来上がった写真たちが保存される配列
let completedPictures;

// 現在選択されているカラー
var currentColor = penColor.black;

// onloadにより実行 
function init() {
  canvasInit();
  logStart();
  userInit();
  buttonInit();

  eventInit();
}

function buttonInit() {
  // drawingモード中の作業モードボタン
  pen_button = document.getElementById("pencil");
  era_button = document.getElementById("eraser");
  sta_button = document.getElementById("stamp");

  back_button = document.getElementById("back_butt");
  next_button = document.getElementById("next_butt");

  textField = document.getElementById("i_text");
  // セーブボタン
  //save_button = document.getElementById("save_butt");
}

function eventInit() {
  // セーブボタン
  //save_button.addEventListener("mousedown", savePictures, false);

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

  pColor = new PenColor();
  changeColor(penColor.black);
  pWidth = penWidth.w3;

  drawingFlag = false;
}

// キャンバスについて、編集する画像の初期化関数
function canvasInit() {
  tc = 0;
  pic_num = 0;

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  imageCanvas = document.getElementById("imageCanvas");
  ictx = imageCanvas.getContext("2d");
  eventCanvas = document.getElementById("eventCanvas");

  // 使用する3枚の画像
  pictures = [];
  pictures[0] = new Image();
  pictures[0].src = "./assets/photos/draw_0.png";
  pictures[1] = new Image();
  pictures[1].src = "./assets/photos/draw_1.png";
  pictures[2] = new Image();
  pictures[2].src = "./assets/photos/draw_2.png";

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

  if (workMode == modeName.stediting)
    return;

  if (workMode == modeName.txediting)
    return;

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[--canvasLog[pic_num].current], 0, 0);

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "destination-out";

  setTimeout(function(){
  }, 150);
}

function next() {
  // これ以上進めない
  if (canvasLog[pic_num].current >= canvasLog[pic_num].top)
    return;

  if (workMode == modeName.stediting)
    return;

  if (workMode == modeName.txediting)
    return;
    
  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "source-over";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasLog[pic_num].log[++canvasLog[pic_num].current], 0, 0);

  if (workMode == modeName.erasering)
    ctx.globalCompositeOperation = "destination-out";

  setTimeout(function(){
  }, 150);
}

function switchPen(){

}

// ペンがキャンバスの外に出たとき、浮いたときに線をやめて
function drawEnd() {
  penX = null;
  penY = null;

  switch (workMode) {
    case modeName.stamping:
    case modeName.stediting:
    case modeName.txediting:
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
  if (workMode == modeName.txediting) {
    text.apply();
    createCache();
  }else {
    console.log("mko");
    createCache();
  }
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
      stamp.resize(0.1);
      break;

    case modeName.stediting:
      console.log('TEST');
      stamp.move(x, y);
      break;

    case modeName.txediting:
      text.move(x, y);
      break;
  }
}

function putText(weight) {
  //二つ以上連続で作成ボタンを押された時
  if (workMode == modeName.txediting) {
    text.canvas.id = "editCanvas" + weight;
    text.fontsize = weight/5 + "px serif";
    text.move(text.x, text.y);
    console.log("asdf");
    return;
  }

  if (loadText()!="")
    text = new Text(input_text, x, y, 50, weight);
    text.fontsize = weight/5 + "px serif";
    text.move(text.x, text.y);
    text.canvas.id = "editCanvas" + weight;
    console.log("asdf");
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

    case modeName.stediting:
      stamp.move(x, y);
      break;

    case modeName.txediting:
      text.move(x, y);
      break;
    }
}

function textResize(size){
  if(!text)
    return;
  
  if(workMode!=modeName.txediting)
    return;

  text.resize(size);
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
  if (workMode == modeName.stediting) {
    stamp.apply();
    delete stamp;
  }

  if (workMode == modeName.txediting) {
    text.apply();
    delete text;
  }

  switch (toolNum) {
    case 0: // ペンモード
      ctx.globalCompositeOperation = "source-over";
      workMode = modeName.drawing;
      break;

    case 1: // 消しゴムモード
      ctx.globalCompositeOperation = "destination-out";
      workMode = modeName.erasering;
      break;

    case 2: // スタンプモード, テキストモード
      ctx.globalCompositeOperation = "source-over";
      workMode = modeName.stamping;
      break;
  }
}

// 色を変える関数
function changeColor(colorID) {
  switch (colorID) {
    case penColor.deepred:
      pColor.r = 193;
      pColor.g = 39;
      pColor.b = 45;
      color = pColor.deepred;
      break;
    case penColor.red:
      pColor.r = 255;
      pColor.b = 0;
      pColor.g = 0;
      color = pColor.red;
      break;
    case penColor.salmonpink:
      pColor.r = 237;
      pColor.g = 30;
      pColor.b = 121;
      color = pColor.salmonpink;
      break;
    case penColor.hotpink:
      pColor.r = 255;
      pColor.g = 105;
      pColor.b = 180;
      color = pColor.hotpink;
      break;
    case penColor.pink:
      pColor.r = 255;
      pColor.g = 192;
      pColor.b = 203;
      color = pColor.pink;
      break;
    
    case penColor.purple:
      pColor.r = 160;
      pColor.g = 0;
      pColor.b = 160;
      color = pColor.purple;
      break;
    case penColor.blue:
      pColor.r = 0;
      pColor.g = 0;
      pColor.b = 255;
      color = pColor.blue;
      break;
    case penColor.deepblue:
      pColor.r = 0;
      pColor.g = 113;
      pColor.b = 176;
      color = pColor.deepblue;
      break;
    case penColor.lightblue:
      pColor.r = 50;
      pColor.g = 200;
      pColor.b = 255;
      color = pColor.lightblue;
      break;
    case penColor.vividblue:
      pColor.r = 0;
      pColor.g = 255;
      pColor.b = 255;
      color = pColor.vividblue;
      break;
    
    case penColor.green:
      pColor.r = 0;
      pColor.g = 255;
      pColor.b = 0;
      color = pColor.green;
      break;
    case penColor.yellow:
      pColor.r = 255;
      pColor.g = 255;
      pColor.b = 0;
      color = pColor.yellow;
      break;
      case penColor.vividorange:
      pColor.r = 251;
      pColor.g = 176;
      pColor.b = 59;
      color = pColor.vividorange;
      break;
    case penColor.orange:
      pColor.r = 247;
      pColor.g = 147;
      pColor.b = 30;
      color = pColor.orange;
      break;
    case penColor.beige:
      pColor.r = 198;
      pColor.g = 156;
      pColor.b = 109;beige
      color = pColor.red;
      break;
    
    case penColor.vividgreen:
      pColor.r = 217;
      pColor.g = 224;
      pColor.b = 33;
      color = pColor.vividgreen;
      break;
    case penColor.darkgreen:
      pColor.r = 85;
      pColor.g = 107;
      pColor.b = 47;
      color = pColor.darkgreen;
      break;
    case penColor.gray:
      pColor.r = 128;
      pColor.g = 128;
      pColor.b = 128;
      color = pColor.gray;
      break;
    case penColor.black:
      pColor.r = 20;
      pColor.g = 20;
      pColor.b = 20;
      color = pColor.black;
      break;
    case penColor.white:
      pColor.r = 255;
      pColor.g = 255;
      pColor.b = 255;
      color = pColor.white;
      break;
    default:
  }
  if (workMode == modeName.erasering) {
    tool(0);
  }
}

// 最後の完成写真を合成して保存する関数
function savePictures() {
  // let toImgCanvas;
  // let data;
  // let bin;
  // let buffer;


  // for(let i = 0; i<3; i++){
  //   toImgCanvas = canvasLog[i].log[canvasLog[i].current];
  //   data   = toImgCanvas.toDataURL('img/png');
  //   bin    = atob(data.split(',')[1]);
  //   buffer = new Uint8Array(bin.length);

  //   for (var j = 0; j < bin.length; j++) {
  //     buffer[j] = bin.charCodeAt(j);
  //   }
  //   let blob = new Blob([buffer.buffer], {type: 'img/png'});
  //   let url = window.URL.createObjectURL(blob);

  //   let downloader = $('#download');
  //   downloader.attr('href', url);
  //   downloader.attr('download', i+'-compic.png');

  //   downloader.click();
  // }

var base64 = canvasLog[0].log[canvasLog[0].current].toDataURL('image/png');
var request = {
    url: 'http://localhost:4567/base64',
    method: 'POST',
    params: {
        image: base64.replace(/^.*,/, '')
    },
    success: function (response) {
        console.log(response.responseText);
    }
};
Ext.Ajax.request(request);
  
}

function PenColor(red, green, blue) {
  this.r = red;
  this.g = green;
  this.b = blue;
}