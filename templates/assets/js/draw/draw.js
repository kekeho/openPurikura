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

// editor
const EDITOR = new Editor(CANVAS_MAIN, CANVAS_EDIT);

// global variable =================================================== //
// current point
let x = CANVAS_MAIN.width / 2;
let y = CANVAS_MAIN.height / 2;

// selected tool
let tool = ID_TOOL.pen;
let color = new Color(ID_COLOR.black);
let width = 15;
let alpha = 1;

// is drawing ? 
let drawing = false;

// draw object
let obj = null;

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

  switch (tool)  {
    case ID_TOOL.pen:
      obj = new Pen(EDITOR, LOG[picture], color, width, alpha);
      obj.line(x, y);
      break;

    case ID_TOOL.effpen:
      obj = new EffectPen(EDITOR, LOG[picture], color, width, alpha);
      obj.line(x, y);
      break;

    case ID_TOOL.eraser:
      obj = new Eraser(EDITOR, LOG[picture], width);
      obj.line(x, y);
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

  switch (DrawObject.getTool())  {
    case ID_TOOL.pen:
    case ID_TOOL.effpen:
    case ID_TOOL.eraser:
      obj.line(x, y);
      break;
  }
}

let onRelease = function(e) {
  drawing = false;
}

CANVAS_EVNT.addEventListener("touchstart"  , onClick  ,  false);
CANVAS_EVNT.addEventListener("touchmove"   , onMove   ,  false);
CANVAS_EVNT.addEventListener("touchend"    , onRelease,  false);
CANVAS_EVNT.addEventListener("touchchancel", onRelease,  false);

// function ========================================================== //
let switchPic = function(idx) {
  if (DrawObject.isEditing())
    obj.apply();

  picture = idx;
  
  CTX_BACK.drawImage(PICTURES[picture], 0, 0, CANVAS_BACK.width, CANVAS_BACK.height);
  
  CTX_MAIN.clearRect(0, 0, CANVAS_MAIN.width, CANVAS_MAIN.height);
  CTX_MAIN.drawImage(LOG[picture].image(), 0, 0);
}

let selectTool = function(id_tool, _width, _alpha) {
  tool = id_tool;
  width = _width;
  alpha = _alpha;
}

let changeColor = function(_color) {
  color.id = _color;
}

let redo = function() {
  if (DrawObject.isEditing())
    obj.apply();

  LOG[picture].redo();
}

let undo = function() {
  if (DrawObject.isEditing())
    obj.apply();

  LOG[picture].undo();
}
