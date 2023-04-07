// Create connection to Node.JS Server
const socket = io();

let bSize = 10;
let canvas;
let drawIsOn = false;

var x, y, z;
var xpos, ypos;

function setup() {
  canvas = createCanvas(500, 500);
  
  menu();
    
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
  
  let data = {
    xPos: x,
    yPos: y,
    zPos: z,
  }
  
  socket.emit('message', data)
}



// Game Menu
function menu() {
  loginPage = select("#login");
  experiencePage = select("#sketch-container");
  messageArea = select(".messages");

  gui = select("#gui-container");
  gui.addClass("open");//forcing it open at the start, remove if you want it closed

  button = createButton(">");
  button.addClass("button");

  //Add the play button to the parent gui HTML element
  button.parent(gui);
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 

  //username input
  usernameInput = createInput("");
  usernameInput.parent("#login-form");
  usernameInput.addClass("usernameInput");
  usernameInput.input(usernameInputEvent);

  //Chate message input
  inputMessage = createInput("");
  inputMessage.parent("#gui-container");
  inputMessage.addClass("inputMessage");
  inputMessage.input(chatInputEvent);
  //type="text" maxlength="14"
  
}

// Sets the client's username
function setUsername(){
  username = cleanInput(usernameInput.value().trim());

  // If the username is valid
  if (username) {
    loginPage.addClass("hide");
    experiencePage.removeClass("hide");
 
    // $currentInput = $inputMessage.focus();

    // Tell the server your username
    socket.emit('add user', username);
  }
}

function usernameInputEvent(){
  console.log(this.value());
}

function chatInputEvent(){
  console.log(this.value());
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


// Web Responsivity
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


