var modeName = {
  waiting:0,
  drawing:1,
  el_se:2
};

var penColor = {
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

var penWeight = {
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

var myCanvas;
var img;
var canvasLog = new Array();
var cc;

var pColor = penColor.red;
var pWeigh = penWeight.w3;

var workMode = 0;

var redButton;


function setup(){
  myCanvas = createCanvas(windowWidth*5/12, windowWidth*5/12);
  //saveCanvas(myCanvas, '../pictures/canvas0', 'png');
  background(255);
  //img = loadImage("assets/img.png");
  stroke(penColor.black);
  //redButton.position(100, 100);
  myCanvas.position(windowWidth*3/11,windowHeight/9);
}

function draw(){
	//background(255);
  //image(img, 0, 0);
}

function mouseDragged(){
  if (1) {
    workMode = modeName.drawing;
    drawLine(mouseX, mouseY);
  }


}

function mousePressed(){

}

function mouseClicked(){
  if(workMode == modeName.waiting){
    // if(mouseX<50 && mouseY<50){
    //   alert("reset");
    // }
  }
}

function mouseReleased(){
  if(workMode == modeName.drawing){
    //myCanvas.getImageData('../pictures/canvas' + ++cc, 'png');
  }
  workMode = modeName.waiting;
}

function drawLine(penX, penY){
  strokeWeight(penWeight.w6);
  // stroke(255, 0, 0);
  line(penX, penY, pmouseX, pmouseY);
  //alert("drawing");
}

function lineColor(color){
  switch (color) {
    case 1:
      stroke();
      break;
    default:

  }
}

function changeColor(colorID){
  switch (colorID) {
    case penColor.red:
      stroke(255, 0, 0);
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
      stroke(0);
  }
}
