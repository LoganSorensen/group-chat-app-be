const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  users,
} = require("../utils/users");
const formatMessage = require("../utils/messages");
const Channel = require("./channels/channels-model");
const Message = require("./messages/messages-model");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "https://lsorensen-group-chat-app.herokuapp.com" },
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

io.on("connection", (socket) => {
  console.log("connection");

  // handles a user joining the room
  socket.on(
    "joinRoom",
    ({ username, profileImg, channel, previousChannel }) => {
      console.log(`${username} has joined ${channel}\n`);

      userJoin(socket.id, username, channel, profileImg);

      socket.leave(previousChannel);

      socket.join(channel);

      io.emit("roomData", users);
    }
  );

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

        console.log(dbMessage);

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

// Routers
const usersRouter = require("./users/users-router");
const channelsRouter = require("./channels/channels-router");
const messagesRouter = require("./messages/messages-router");
const authRouter = require("./auth/auth-router");

// Routes
app.use("/api/users", usersRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: process.env.MOTD || "api is up" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
