const socket = io();
let input;

function setup() {
  createCanvas(100, 100);
  background( 'pink' );
  
  input = 0;
  
  socket.on("message", newMsg);

  function newMsg(data) {
    input = data;
    console.log(data);
  }
}

function draw() { 
  print(input);
  text(data, width/2, height/2);

}