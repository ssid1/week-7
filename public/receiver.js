const socket = io();
let canvas, dataInput, username, prover, currentUsers;

let activeUsers = [];

let startButton;

let positioning = 0;

let users = [];

function setup() {
  canvas = createCanvas(500, 500);
  // canvas.parent("sketch-container");
  
  currentUsers = 0;

  

}

function draw() { 
  background( 'pink' );
  
  receiveData();
  //    console.log(currentUsers);  
  // console.log(user);
  // // console.log(activeUsers);
  
  
  for (let i = currentUsers - 1; i >= 0; i--) {
    users[i].update();

    users[i].list();
  }
  
  

}

function receiveData() {
  socket.on("message", newData);
  // socket.on("add user", newLogin);
  // socket.on('connected', newLogin); DELETE

  function newData(data) {
    dataInput = data.accelData;
    username = data.username;
    currentUsers = data.users;
    
    // console.log(username);
  }
  
  function newLogin(data) {
    // currentUsers = data;
  }
    // console.log(currentUsers);
  
  
  for (let i = 0; i <= users.length; i++) {
    if (username != activeUsers && username != undefined) {
      activeUsers.push(username);
      let u = new User(username, dataInput);
      users.push(u);
    }
  }
  
  // function newLogin(data) { DELETE
  //   currentUsers = data;
  //   console.Log(data)
  // }

}

// function createUsers() {
//   for (let i = 0; i < activeUsers.length; i++) {
//     if (username = )
//           let u = new User(username, input);
//         users.push(u);
//   }
// }

// Game Menu
function menu() {
  

}

function layout() {
}

class User {
 constructor(keyName, accelData) {
   this.name = keyName;
   this.xPos = accelData.xPos;
   this.yPos = accelData.yPos; 
   this.zPos = accelData.zPos; 
   
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
  
  update() {
   this.xPos = dataInput.xPos;
   this.yPos = dataInput.yPos; 
   this.zPos = dataInput.zPos; 
    
  // this.x = width/findIndex(users, this.User);
    // print(this.User);
    
  }
  
  postion() {
    for (let i = 0; i < users.length; i++) {
    }
  }
}