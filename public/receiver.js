const socket = io();
let input;

function setup() {
  createCanvas(100, 100);
  background( 'pink' );
  
  socket.on("data", newMsg);

  function newMsg(data) {
    input = Int32Array(data);
    print(Int32Array(data));
  }
}

function draw() { 
  print(input);


}