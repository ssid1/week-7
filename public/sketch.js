// Create connection to Node.JS Server
const socket = io();

const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

// Initialize variables

// HTML elements
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


function setup() {

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); 

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

function draw() {

  background(0);

}

function addParticipantsMessage(data){
  let message = '';
  if (data.numUsers === 1) {
    message += `there's 1 participant`;
  } else {
    message += `there are ${data.numUsers} participants`;
  }

  addLogElement(message);
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

// Sends a chat message
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


// Adds the visual chat message to the message list
function addChatMessage(data, options = {}){
  // Don't fade the message in if there is an 'X was typing'
  // const typingMessages = getTypingMessages(data);
  // if ($typingMessages.length !== 0) {
  //   options.fade = false;
  //   $typingMessages.remove();
  // }

  let typingClass = data.typing ? 'typing' : '';
  let messageDiv = createDiv("");
  messageDiv.parent(messageArea);
  messageDiv.addClass("message");
  
  let userNameSpan = createSpan(data.username);
  userNameSpan.parent(messageDiv);
  userNameSpan.addClass("username");
  userNameSpan.style("color",getUsernameColor(data.username));
  
  let messageBodySpan = createSpan(data.message);
  messageBodySpan.parent(messageDiv);
  messageBodySpan.addClass("messageBody");

  messageDiv.addClass(typingClass)

  messageArea.elt.parentElement.scrollTop = messageArea.elt.parentElement.scrollHeight;
}

// Adds the visual chat typing message
function addChatTyping(data){
  data.typing = true;
  data.message = 'is typing';
  addChatMessage(data);
}

// Removes the visual chat typing message
function removeChatTyping(data){
  getTypingMessages(data).fadeOut(function () {
    $(this).remove();
  });
}

// Adds a message element to the messages and scrolls to the bottom
// el - The element to add as a message
// options.fade - If the element should fade-in (default = true)
// options.prepend - If the element should prepend
//   all other messages (default = false)
function addLogElement(text, options){

  const p = createP(text);
  p.parent(messageArea);
  p.addClass('log');

  messageArea.elt.scrollTop = messageArea.elt.scrollHeight;
}

// Prevents input from having injected markup
function cleanInput(input){
  //remove all html tags, so no one can mess with your system
  let clean = input.replace( /(<([^>]+)>)/ig, '');
  return clean;
}

// Updates the typing event
function updateTyping(){
  if (connected) {
    if (!typing) {
      typing = true;
      socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
      const typingTimer = (new Date()).getTime();
      const timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        socket.emit('stop typing');
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  }
}

// Gets the 'X is typing' messages of a user
function getTypingMessages(data){
  return $('.typing.message').filter(function (i) {
    return $(this).data('username') === data.username;
  });
}

// Gets the color of a username through our hash function
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
 // Socket events

// Whenever the server emits 'login', log the login message
socket.on('login', (data) => {
  connected = true;
  // Display the welcome message
  const message = 'Welcome to Socket.IO Chat – ';
  addLogElement(message);
  addParticipantsMessage(data);
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', (data) => {
  addChatMessage(data);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', (data) => {
  addLogElement(`${data.username} joined`);
  addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', (data) => {
  addLogElement(`${data.username} left`);
  addParticipantsMessage(data);
  removeChatTyping(data);
});

// Whenever the server emits 'typing', show the typing message
socket.on('typing', (data) => {
  // addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', (data) => {
  // removeChatTyping(data);
});

socket.on('disconnect', () => {
  addLogElement('you have been disconnected');
});

socket.io.on('reconnect', () => {
  addLogElement('you have been reconnected');
  if (username) {
    socket.emit('add user', username);
  }
});

socket.io.on('reconnect_error', () => {
  addLogElement('attempt to reconnect has failed');
});
