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
  
  print(username);
  text(input.xPos, width/2, height/4);
  text(input.yPos, width/2, height/2);
  text(input.zPos, width/2, height *3/4);

}

function receiveAccel() {
    socket.on("message", newData);
    socket.on("username", newUser);


  function newData(data) {
    input = data;
    // console.log(data);
  }
  
  function newUser(data) {
    username = data;
    // console.log(data);
  }
}

// Game Menu
function menu() {
  

}


class User {
 constructor(keyName, accelData) {
   this.name = keyName;
   this.xPos = accelData.x; 
   this.yPos = accelData.y; 
   this.zPos = accelData.z; 
   
 }
   
  list() {
    
  }
}