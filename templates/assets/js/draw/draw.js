"use strict";

// enum ============================================================== //
const ID_TOOL = {
  pen    : 0,
  eraser : 1,
  stamp  : 2,
  text   : 3
};

const ID_COLOR = {
  deepred    : 0,
  red        : 1,
  salmonpink : 2,
  hotpink    : 3,
  pink       : 4,

  purple     : 5,
  blue       : 6,
  deepblue   : 7,
  lightblue  : 8,
  vividblue  : 9,

  green      : 10,
  yellow     : 11,
  vividorange: 12,
  orange     : 13,
  beige      : 14,

  vividgreen : 15,
  darkgreen  : 16,
  gray       : 17,
  black      : 18,
  white      : 19
};

// constant ========================================================== //
// back
const PICTURES = [new Image(), new Image(), new Image()];
for (let i = 0; i < 3; i++)
  PICTURES[i].src = "./assets/photos/c" + cache_num + "_after-" + id_photos[i] + ".png";

// canvas
const CANVAS_BACK = document.getElementByID("canvas-back");
const CANVAS_MAIN = document.getElementByID("canvas-main");
const CANVAS_EVNT = document.getElementByID("canvas-evnt");

// context 
const CTX_BACK = CANVAS_BACK.getContext("2d");
const CTX_MAIN = CANVAS_MAIN.getContext("2d");

// log
const LOG = [new Log(CANVAS_MAIN), new Log(CANVAS_MAIN), new log(CANVAS_MAIN)];

// global variable =================================================== //
// current point
let x_c = CANVAS_MAIN.width / 2;
let y_c = CANVAS_MAIN.height / 2;

// previous point
let x_p = CANVAS_MAIN.width/2;
let y_p = CANVAS_MAIN.height/2;

// selected tool
let tool = ID_TOOL.pen;

// selected color
let color = ID_COLOR.black;

// selected picture index
let picture = 0;

// is drawing ? 
let drawing = false;

// instance
let stamp = null;
let text  = null;

// initialize ======================================================== //
// draw PICTURE on CANVAS_BACK
CTX_BACK.drawImage(PICTURE[0], 0, 0, CANVAS_BACK.wdth, CANVAS_BACK.height);

// add eventlistenr for iPad to CANVAS_EVNT
let onClick = function(e) {

}

let onMove = function(e) {

}

let onRelease = function(e) {

}

CANVAS_EVNT.addEventListener("touchstart"  , onClick  ,  false);
CANVAS_EVNT.addEventListener("touchmove"   , onMove   ,  false);
CANVAS_EVNT.addEventListener("touchend"    , onRelease,  false);
CANVAS_EVNT.addEventListener("touchchancel", onRelease,  false);

// function ========================================================== //
let switchPic = function(idx) {
  LOG[picture].add();
  picture = idx;
  
  CTX_BACK.drawImage(PICTURE[picture], 0, 0, CANVAS_BACK.width, CANVAS_BACK.heihgt);
  
  CTX_MAIN.clearRect(0, 0, CANVAS_MAIN.width, CANVAS_MAIN.height);
  CTX_MAIN.drawImage(LOG[picture].image(), 0, 0);
}

let redo = function() {
  LOG[picture].redo();
}

let undo = function() {
  if (stamp != null) {
    stamp.apply();
    stamp = null;
    LOG[picture].add();
  } else if (text != null) {
    text.apply();
    text = null;
    LOG[picture].add();
  }

  LOG[picture].undo();
}

