// Import Libraries and Setup

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Tell our Node.js Server to host our P5.JS sketch from the public folder.
app.use(express.static("public"));

// Setup Our Node.js server to listen to connections from chrome, and open chrome when it is ready
server.listen(3000, () => {
  console.log("listening on *:3000");
});

let printEveryMessage = false;

let numUsers = 0;

// Callback function for what to do when our P5.JS sketch connects and sends us messages
io.on("connection", (socket) => {
  let addedUser = false;

  // socket.on("connected", (data) => {
  //   socket.broadcast.emit("userNum", numUsers);
  // });

  // console.log("a user connected");

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;    
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // Code to run every time we get a message from front-end P5.JS
  socket.on("message", (data) => {
    
    
    //do something
    socket.broadcast.emit("message", { accelData: data, username: socket.username }); //broadcast.emit means send to everyone but the sender
    console.log(socket.username);

    // Print it to the Console
    if (printEveryMessage) {
      socket.emit(data);
    }
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username,
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});
