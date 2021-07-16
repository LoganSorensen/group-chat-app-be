const router = require("express").Router();
const Messages = require("./messages-model");
const moment = require("moment");

router.get("/", (req, res, next) => {
  Messages.getAll()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(next);
});

// Get messages by room name
router.get("/:channel_id", (req, res, next) => {
  const channel_id = req.params.channel_id;

  Messages.getBy({ channel_id })
    .then((messages) => {
      const response = [];

      messages.forEach((message) => {
        response.push({
          ...message,
          // changes the time stamp to be relative to the current time
          timestamp: moment(message.timestamp).calendar(),
        });
      });
      res.status(200).json(response);
    })
    .catch(next);
});

module.exports = router;
