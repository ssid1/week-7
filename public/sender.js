// Create connection to Node.JS Server
const socket = io();


let loginPage;        // The login page // '.login.page'
let experiencePage;        // The main experience //'.experience.page'

let canvas;
let gui; 

//input DOM elements
let usernameInput; // Input for username // '.usernameInput'
let inputMessage;   // Input message input box //'.inputMessage'
let messageArea;    // Messages area // '.messages'

// Prompt for setting a username
let username;
let connected = false;
let typing = false;
let lastTypingTime;

//going to store which text field we listen to
let currentInput; // focus usernameInput fist


let drawIsOn = false;

var x, y, z;



function setup() {
  canvas = createCanvas(500, 500);
  navigator.vibrate = navigator.vibrate || 
                      navigator.webkitVibrate ||
                      navigator.mozVibrate ||
                      navigator.msVibrate;
  
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
  
  let threshold = 10
  
    if (x >= threshold || y >= 20 || z >= 20) {
    navigator.vibrate(1000);
  }
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
  
  socket.emit('message', data);
  
  
  
  // button = createButton('buzz');
  // button.position(width/2, height/2);
  // button.mousePressed(  navigator.vibrate(1000)); // WORKS!
  
  averager(data);
}


function averager(data) {
  // let average = (x + y + z)/3;

  
}

// Game Menu
function menu() {
  loginPage = select("#login");
  experiencePage = select("#sketch-container");
  messageArea = select(".messages");

  // gui = select("#gui-container");
  // gui.addClass("open");//forcing it open at the start, remove if you want it closed

  // button = createButton(">");
  // button.addClass("button");

  //Add the play button to the parent gui HTML element
  // button.parent(gui);
  
  //Adding a mouse pressed event listener to the button  

  //username input
  usernameInput = createInput("");
  usernameInput.parent("#login-form");
  usernameInput.addClass("usernameInput");
  usernameInput.input(usernameInputEvent);

  //Chate message input WE DONT NEED THIS
  // inputMessage = createInput("");
  // inputMessage.parent("#gui-container");
  // inputMessage.addClass("inputMessage");
  // inputMessage.input(chatInputEvent);
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

function sendMessage(){
  let message = inputMessage.value();
  // Prevent markup from being injected into the message
  message = cleanInput(message);
  // if there is a non-empty message and a socket connection
  if (message && connected) {
    inputMessage.value('');
    addChatMessage({ username, message });
    // tell server to execute 'new message' and send along one parameter
    socket.emit('new message', message);
  }
}


function usernameInputEvent(){
  console.log(this.value());
}

function chatInputEvent(){
  console.log(this.value());
}

function handleButtonPress()
{
    gui.toggleClass("open");
}

function getUsernameColor(username){
  // Compute hash code
  let hash = 7;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

//Events we are listening for

function keyPressed(){
  if (keyCode === ENTER) {
    if (username) {
      sendMessage();
      socket.emit('stop typing');
      typing = false;
    } else {
      setUsername();
    }
  }
  console.log(username);
  
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


function cleanInput(input){
  //remove all html tags, so no one can mess with your system
  let clean = input.replace( /(<([^>]+)>)/ig, '');
  return clean;
}

socket.on("data",(data) => {
  
  drawEvent(data);
  
});



// Web Responsivity
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


