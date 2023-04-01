// Import Libraries and Setup

const express = require("express");
const app = express();
const http = require("http");
const server = require('http').Server(app); //??!
const { Server } = require("socket.io");
const io = new Server(server);

// Tell our Node.js Server to host our P5.JS sketch from the public folder.
app.use(express.static("public"));
io.connect( "/" );


// Setup Our Node.js server to listen to connections from chrome, and open chrome when it is ready
server.listen(3000, () => {
  console.log("listening on *:3000");
});

let printEveryMessage = false; 



// Callback function for what to do when our P5.JS sketch connects and sends us messages
io.on("connection", (socket) => {
  console.log("a user connected");

//add in data 
  socket.on("data",(data) => {
    //do some stuff
   
    socket.broadcast.emit("data",data);
    
    if (printEveryMessage) {
      console.log(data);
    }
  });


});