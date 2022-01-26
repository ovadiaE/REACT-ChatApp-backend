const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require('dotenv');
const index = require("./routes/index")
const socket = require("socket.io")
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");

dotenv.config({path: './config/config.env'});

const app = express();

app.use(cors());
app.use(index);

const server = http.createServer(app);

const io = socket(server, {
  cors: {
      origin: "https://lucid-ptolemy-a40286.netlify.app/",
  }
}); 
const port = process.env.PORT || 8000
server.listen(port, () => console.log(`Listening on port ${port}`));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, roomname }) => {
    const p_user = join_User(socket.id, username, roomname);
    socket.join(p_user.room);
    
    // display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });


  //gets the room user and the message sent
  socket.on("chat", (text) => {
    const p_user = get_Current_User(socket.id);
    console.log(p_user)

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
      time: new Date().getTime(),
    });
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
  });
});
