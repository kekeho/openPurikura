"use strict";

// constant ========================================================== //
// back
let picture = 0;
const PICTURES = [new Image(), new Image(), new Image()];
for (let i = 0; i < 3; i++)
  PICTURES[i].src = "./assets/photos/c" + cache_num + "_after-" + id_photos[i] + ".png";

// canvas
const CANVAS_BACK = document.getElementById("canvas-back");
const CANVAS_MAIN = document.getElementById("canvas-main");
const CANVAS_EDIT = document.getElementById("canvas-edit");
const CANVAS_EVNT = document.getElementById("canvas-evnt");

// context 
const CTX_BACK = CANVAS_BACK.getContext("2d");
const CTX_MAIN = CANVAS_MAIN.getContext("2d");

// log
const LOG = [new Log(CANVAS_MAIN), new Log(CANVAS_MAIN), new Log(CANVAS_MAIN)];

// global variable =================================================== //
// current point
let x = CANVAS_MAIN.width / 2;
let y = CANVAS_MAIN.height / 2;

// selected tool
let tool = ID_TOOL.pen;
let color = new Color(ID_COLOR.black);
let width = 15;
let alpha = 1;

// stamp image
let img_stamp = new Image();

// is drawing ? 
let drawing = false;

// draw object
let obj = null;
DrawObject.setCanvas(CANVAS_MAIN, CANVAS_EDIT);

// initialize ======================================================== //
// draw PICTURES on CANVAS_BACK
PICTURES[picture].onload = function(e) {
  CTX_BACK.drawImage(PICTURES[picture], 0, 0, CANVAS_BACK.width, CANVAS_BACK.height);
  document.getElementById("picture-" + picture).click();
};

// add eventlistenr for iPad to CANVAS_EVNT
let onClick = function(e) {
  drawing = true;

  e.preventDefault();
  let rect = e.target.getBoundingClientRect();

  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  }

  // 描画オブジェクトの生成
  switch (tool)  {
    case ID_TOOL.pen:
      obj = new Pen(LOG[picture], color, width, alpha);
      obj.line(x, y);
      break;

    case ID_TOOL.effpen:
      obj = new EffectPen(LOG[picture], color, width, alpha);
      obj.line(x, y);
      break;

    case ID_TOOL.eraser:
      obj = new Eraser(LOG[picture], width);
      obj.line(x, y);
      break;

    case ID_TOOL.stamp:
    case ID_TOOL.text:
      if (DrawObject.isEditing())
        obj.move(x, y);
      break;
  }
}

let onMove = function(e) {
  if (!drawing || !DrawObject.isEditing())
    return;

  e.preventDefault();
  let rect = e.target.getBoundingClientRect();

  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  }

  // 描画オブジェクトの更新
  switch (DrawObject.getTool())  {
    case ID_TOOL.pen:
    case ID_TOOL.effpen:
    case ID_TOOL.eraser:
      obj.line(x, y);
      break;

    case ID_TOOL.stamp:
    case ID_TOOL.text:
      obj.move(x, y);
      break;
  }
}

let onRelease = function(e) {
  drawing = false;
}

// event listener ========================================================= //
CANVAS_EVNT.addEventListener("touchstart"  , onClick  ,  false);
CANVAS_EVNT.addEventListener("touchmove"   , onMove   ,  false);
CANVAS_EVNT.addEventListener("touchend"    , onRelease,  false);
CANVAS_EVNT.addEventListener("touchchancel", onRelease,  false);

// function ========================================================== //
// 背景画像切り替え
let switchPic = function(idx) {
  if (DrawObject.isEditing())
    obj.apply();

  picture = idx;
  
  CTX_BACK.drawImage(PICTURES[picture], 0, 0, CANVAS_BACK.width, CANVAS_BACK.height);
  
  CTX_MAIN.clearRect(0, 0, CANVAS_MAIN.width, CANVAS_MAIN.height);
  CTX_MAIN.drawImage(LOG[picture].image(), 0, 0);
}

// ツールの選択
let selectTool = function(_tool, _width, _alpha) {
  tool = _tool;
  width = _width;
  alpha = _alpha;
}

// 色変更
let changeColor = function(_color) {
  color.id = _color;

  switch (DrawObject.getTool())  {
    case ID_TOOL.stamp:
    case ID_TOOL.text:
      obj.color = color;
      break;
  }
}

// スタンプ配置
let putStamp = function(_type, _num) {
  obj = new Stamp(LOG[picture], color, 200, _type, _num);
  tool = ID_TOOL.stamp;
}

// テキスト配置
let putText = function() {
  let text = document.getElementById("i_text").value;
  obj = new Text(LOG[picture], color, 80, text);
  tool = ID_TOOL.text;
}

// 拡大
let zoomIn = function() {
  switch (DrawObject.getTool())  {
    case ID_TOOL.stamp:
    case ID_TOOL.text:
      if (obj.size < 500)
        obj.size += 30;
      break;
  }
}

// 縮小
let zoomOut = function() {
  switch (DrawObject.getTool())  {
    case ID_TOOL.stamp:
    case ID_TOOL.text:
      if (obj.size > 50)
        obj.size -= 30;
      break;
  }
}

// 回転
let rotate = function(_angle) {
  switch (DrawObject.getTool())  {
    case ID_TOOL.stamp:
    case ID_TOOL.text:
        obj.angle += 10 * _angle;
      break;
  }
}

// やり直し
let redo = function() {
  if (DrawObject.isEditing())
    obj.apply();

  LOG[picture].redo();
}

// 元に戻す
let undo = function() {
  if (DrawObject.isEditing())
    obj.apply();

  LOG[picture].undo();
}
