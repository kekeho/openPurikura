function setup(){
  createCanvas(1280*3/4,800*3/4);
  background(255);
}

function draw(){
	background(255);
	noStroke();
	fill(15);
  ellipse(300, 300, 10, 10);
}

function Line(touch_x, touch_y, line_width, line_color, line_alpha){
	var elements = [];
	this.write = function(x, y){
		this.elements.push(new LineElement(touch_x, touch_y, line_width, line_color, line_alpha));

	}

	this.display = function(){
    for(var i=0; i<this.elements.length; i++){
      this.elements[i].display();
    }
	}
}

function LineElement(x, y, line_width, color, alpha){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.alpha = alpha;

	this.display = function(){
		fill(this.color, this.alpha);
		ellipse(this.x, this.y, this.width, this.height);
    fill(255);
	}
}
