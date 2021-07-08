const router = require("express").Router();
const Messages = require("./messages-model");

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
      res.status(200).json(messages);
    })
    .catch(next);
});

module.exports = router;
