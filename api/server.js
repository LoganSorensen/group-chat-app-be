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
const Channel = require("./channels/channels-model");
const Message = require("./messages/messages-model");

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("connection");

  // handles a user joining the room
  socket.on("joinRoom", ({ username, profileImg, channel, previousChannel }) => {
    console.log(`${username} has joined ${channel}\n`);

    userJoin(socket.id, username, channel, profileImg);

    socket.leave(previousChannel);

    socket.join(channel);

    io.emit("roomData", users);
  });

  // handles a user sending a message
  socket.on("chatMessage", (data) => {
    const user = getCurrentUser(socket.id);

    // adds the incoming message to the database
    Channel.getBy({ channel_name: data.channel })
      .then((channel) => {
        const dbMessage = {
          message_text: data.message,
          user_id: data.senderId,
          channel_id: channel[0].id,
        };

        Message.add(dbMessage);
      })
      .catch((err) => console.log(err));

    io.to(data.channel).emit(
      "message",
      formatMessage(user.username, user.profileImg, data.message)
    );
  });

  // // handles a client disconnecting
  socket.on("disconnect", () => {
    userLeave(socket.id);
    console.log("a user left\n");
    io.emit("roomData", users);
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
