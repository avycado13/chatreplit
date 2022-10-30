const { getUserInfo } = require("@replit/repl-auth")
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const allowed_rooms = ["Room1", "Room2", "Room3", "Coding"];

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var rooms = [];
var usernames = [];
var passwords = [];

io.on('connection', function(socket){

  socket.on("join", function(room, username, password){
    if (username != "")
    {
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      passwords[socket.id] = password;
      socket.leaveAll();
      socket.join(room);
      if (allowed_rooms.includes(room)) 
      {
        if (password != "avycodedthis!") 
        {
      io.in(room).emit("recieve", "Server : " + username + " cannot enter the chat.");  
      } else 
      {
      io.in(room).emit("recieve", "Server : " + username + " has entered the chat.");
      socket.emit("join", room);
         socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] +" : " + message);
  })
  socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })
      }
      } else {
      io.in(room).emit("recieve", "Server : " + room + " does not exist.");  
      }
    }
  }
            
           )

 
} )
