const express = require('express')
const helmet = require('helmet')
const cors = require('cors')


const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.get("/", (req,res)=>{
    res.status(200).json({ message: process.env.MOTD });  
})

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });

module.exports = server;