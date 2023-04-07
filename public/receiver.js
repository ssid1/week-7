const socket = io();
let canvas, input, username, prover;


let startButton;

let users = [];

function setup() {
  canvas = createCanvas(500, 500);
  // canvas.parent("sketch-container");

  

}

function draw() { 
  background( 'pink' );
  
  receiveData();
  
  
  
  for (i = users.length; i > 0; i--) {
    users[i].show();
  }

}

function receiveData() {
  socket.on("message", newData);
  socket.on("connected", newProof);

  function newData(data) {
    input = data.accelData;
    username = data.username;
    // console.log(username);
    // console.log(input);
  }
  
  function newProof(proof) {
    // prover = proof;
    // console.log(username + " connnected");
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
   this.h = height/5;
   
 }
   
  list() {
    textSize(height/30);
    text(this.name, this.x, this.h);
    text(this.xPos, this.x, this.h*2);
    text(this.yPos, this.x, this.h*3);
    text(this.zPos, this.x, this.h*4);
    
  }
}