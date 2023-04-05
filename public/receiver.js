const socket = io();
let input;

function setup() {
  createCanvas(100, 100);
  background( 'pink' );
  
  input = 0;
  
  socket.on("data", newMsg);

  function newMsg(data) {
    input = Int32Array(data);
    console.log(input);
  }
}

function draw() { 
  print(input);
  text(input, width/2, height/2);

}