const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("./users/users-router");
const channelsRouter = require("./channels/channels-router");
const messagesRouter = require("./messages/messages-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/users", usersRouter);
server.use("/api/channels", channelsRouter);
server.use("/api/messages", messagesRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: process.env.MOTD });
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
