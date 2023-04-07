const socket = io();
let canvas, input, username, prover, currentUsers;


let startButton;

let users = [];

function setup() {
  canvas = createCanvas(500, 500);
  // canvas.parent("sketch-container");
  
  currentUsers = 0;

  

}

function draw() { 
  background( 'pink' );
  
  receiveData();
     console.log(currentUsers);
  
  // console.log(users);
  
  
  for (let i = currentUsers - 1; i >= 0; i--) {
    users[i].show();
  }
  
  

}

function receiveData() {
  socket.on("message", newData);
  // socket.on("add user", newLogin);
  // socket.on('connected', newLogin); DELETE

  function newData(data) {
    input = data.accelData;
    username = data.username;
    currentUsers = data.users;
    
    // console.log(username);
  }
  
  function newLogin(data) {
    // currentUsers = data;
  }
    // console.log(currentUsers);
  
  
  for (let i = 0; i <= users.length; i++) {
    if (username != users[i]) {
      let u = new User(username, input)
    }
  }
  
  // function newLogin(data) { DELETE
  //   currentUsers = data;
  //   console.Log(data)
  // }

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
   
   this.x = width/2;
   // this.x = widthPos;
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