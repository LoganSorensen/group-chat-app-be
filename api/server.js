const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
// const socketio = require("socket.io");
const io = require("socket.io")(8800, {
  cors: { origin: "http://localhost:3000" },
});

const usersRouter = require("./users/users-router");
const channelsRouter = require("./channels/channels-router");
const messagesRouter = require("./messages/messages-router");
const authRouter = require("./auth/auth-router");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  users,
} = require("../utils/users");
const formatMessage = require("../utils/messages");

const app = express();
const server = http.createServer(app);
// const io = socketio(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

const botName = "admin";

io.on("connection", (socket) => {
  console.log("connection");

  // handles a user joining the room
  socket.on("joinRoom", ({ username, room }) => {
    console.log(`${username} has joined ${room}\n`);

    // const user = userJoin(socket.id, username, room);
    userJoin(socket.id, username, room);

    //   socket.join(user.room);

    //   console.log('\nusers:', users)

    //   socket.emit(
    //     "message",
    //     formatMessage(botName, `${user.username} has joined ${user.room}!`)
    //   );

    //   // Send users and room info
    //   io.to(user.room).emit('roomData', {
    //     room: user.room,
    //     users: getRoomUsers(user.room)
    //   })
  });

  // handles a user sending a message
  socket.on("chatMessage", (message) => {
    console.log("message received", message);
    const user = getCurrentUser(socket.id);

    console.log(user);

    io.to(socket.id).emit("message", formatMessage(user.username, message));

    // io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // // handles a client disconnecting
  // socket.on("disconnect", () => {
  //   console.log('users before',users)
  //   const user = userLeave(socket.id);
  //   console.log(`${user.username} has left the room.`)
  //   console.log('users after', users)

  //   if (user) {
  //     io.to(user.room).emit(
  //       "message",
  //       formatMessage(botName, `${user.username} has left the room.`)
  //     );

  //     io.to(user.room).emit("roomUsers", {
  //       room: user.room,
  //       users: getRoomUsers(user.room),
  //     });
  //   }
  // });
});

app.use("/api/users", usersRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

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
