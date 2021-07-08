const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const usersRouter = require("./users/users-router");
const channelsRouter = require("./channels/channels-router");
const messagesRouter = require("./messages/messages-router");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");
const formatMessage = require("../utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

const botName = "admin";

io.on("connection", (socket) => {
  console.log("We have a new connection!");

  // handles a user joining the room
  socket.on("joinRoom", ({ username, room }) => {
    console.log(`${username} has joined ${room}\n`);

    const user = userJoin(socket.id, username, room);

    socket.emit(
      "message",
      formatMessage(botName, `${user.username} has joined ${user.room}!`)
    );

    socket.join(user.room);
  });

  // handles a user sending a message
  socket.on("chatMessage", (message) => {
    // console.log("message recieved");
    const user = getCurrentUser(socket.id);

    // console.log(`sending ${message} to ${user.room}`);

    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // handles a client disconnecting
  socket.on("disconnect", () => {
    console.log("user is leaving");
    const user = userLeave(socket.id);

    console.log(user);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the room.`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use("/api/users", usersRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: process.env.MOTD });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
