/* enum ============================================================== */
const TOOL = {
  pen    : 0,
  eraser : 1,
  stamp  : 2,
  text   : 3
};

const COLOR = {
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

/* constant ========================================================== */
/* canvas */
const CANVAS_BACK = Document.getElementByID('canvas-back');
const CANVAS_MAIN = Document.getElementByID('canvas-main');
const CANVAS_EDIT = Document.getElementByID('canvas-edit');
const CANVAS_EVNT = Document.getElementByID('canvas-evnt');

/* context */
const CTX_BACK = CANVAS_BACK.getContext('2d');
const CTX_MAIN = CANVAS_MAIN.getContext('2d');
const CTX_EDIT = CANVAS_EDIT.getContext('2d');

/* back */
const PICTURE = [new Image(), new Image(), new Image()];

/* global variable =================================================== */
/* current point */
let x_c = 466/2;
let y_c = 466/2;

/* previous point */
let x_p = 466/2;
let y_p = 466/2;

/* selected color */
let color = COLOR.black;

/* selected tool */
let tool = TOOL.pen;

/* selected picture index */
let picture = 0;

/* is drawing ? */
let drawing = false;

$(function(){
  
});