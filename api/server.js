const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require('http')
const socketio = require("socket.io");

const usersRouter = require("./users/users-router");
const channelsRouter = require("./channels/channels-router");
const messagesRouter = require("./messages/messages-router");

const app = express();
const server = http.createServer(app)
const io = socketio(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('We have a new connection!')

  socket.on('joinRoom', ({username, room}) => {
    console.log(`${username} has joined ${room}`)
  })
})

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
