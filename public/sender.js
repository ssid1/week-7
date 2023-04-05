// Create connection to Node.JS Server
const socket = io();

let bSize = 10;
let canvas;
let drawIsOn = false;

var x, y, z;
var xpos, ypos;

function setup() {
  canvas = createCanvas(500, 500);
    
  //set styling for the sketch
  noStroke();

  xpos = 200;
  ypos = 200;
  x = 0;
  y = 0;
}

// accelerometer Data
window.addEventListener('devicemotion', function(e) 
{
  // get accelerometer values
  x = parseInt(e.accelerationIncludingGravity.x);
  y = parseInt(e.accelerationIncludingGravity.y);
  z = parseInt(e.accelerationIncludingGravity.z); 
});

function draw() {
  background(255);

  
  // add/subract xpos and ypos
  xpos = xpos + x;
  ypos = ypos - y;

  // wrap ellipse if over bounds
  if(xpos > 400) { xpos = 0; }
  if(xpos < 0) { xpos = 400; }
  if(ypos > 400) { ypos = 0; }
  if(ypos < 0) { ypos = 400; }

    // display variables
    fill(0);
    noStroke();
    text("x: " + x, 25, 25);
    text("y: " + y, 25, 50);
    text("z: " + z, 25, 75); 
}

//Events we are listening for

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on disconnect event
socket.on("disconnect", () => {
  console.log(socket.id);
});

//Add Callback for drawing message

socket.on("data",(data) => {
  
  drawEvent(data);
  
});


