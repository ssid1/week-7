const socket = io();
let canvas, input, username;


let startButton;

let users = [];

function setup() {
  canvas = createCanvas(500, 500);
  // canvas.parent("sketch-container");
  
  input = 0;
  
  receiveAccel();

}

function draw() { 
  background( 'pink' );
  
  // print(username);
  // text(username, width/2, height/5);
  // text(input.xPos, width/2, height/4);
  // text(input.yPos, width/2, height/2);
  // text(input.zPos, width/2, height *3/4);

}

function receiveAccel() {
    socket.on("message", newData);


  function newData(data) {
    input = data.accelData;
    username = data.username;
    // console.log(username);
    // console.log(input);
  }

}

// Game Menu
function menu() {
  

}


class User {
 constructor(keyName, accelData, widthPos) {
   this.name = keyName;
   this.xPos = accelData.x; 
   this.yPos = accelData.y; 
   this.zPos = accelData.z; 
   
   this.x = widthPos;
   
 }
   
  list() {
    text(username, width/2, height/5);
    text(input.xPos, width/2, height/4);
    text(input.yPos, width/2, height/2);
    text(input.zPos, width/2, height *3/4);
    
  }
}