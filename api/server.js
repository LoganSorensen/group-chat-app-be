const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
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

app.use(helmet());
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("connection");

  // handles a user joining the room
  socket.on("joinRoom", ({ username, channel, previousChannel }) => {
    console.log(`${username} has joined ${channel}\n`);

    userJoin(socket.id, username, channel);

    socket.leave(previousChannel)

    console.log(`going from ${previousChannel} to ${channel}`)

    socket.join(channel);

    // console.log(channel)

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
  socket.on("chatMessage", (data) => {
    const user = getCurrentUser(socket.id);

    console.log(`${user.username} is sending ${data.message} to ${data.channel}`);
    io.to(data.channel).emit(
      "message",
      formatMessage(user.username, data.message)
    );
  });

  // // handles a client disconnecting
  socket.on("disconnect", () => {
    userLeave(socket.id);
    console.log("a user left\n");
  });
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
