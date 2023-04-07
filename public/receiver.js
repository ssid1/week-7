const socket = io();
let canvas, input;

let startButton;

function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch-container");
  
  input = 0;
  
  socket.on("message", newMsg);

  function newMsg(data) {
    input = data;
    // console.log(data);
  }
}

function draw() { 
  background( 'pink' );
  
  print(input);
  text(input.xPos, width/2, height/4);
  text(input.yPos, width/2, height/2);
  text(input.zPos, width/2, height *3/4);

}

// Game Menu
function menu() {
  

}