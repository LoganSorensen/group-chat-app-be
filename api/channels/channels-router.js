const router = require("express").Router();
const Channels = require("./channels-model");

router.get("/", (req, res, next) => {
  Channels.getAll()
    .then((channels) => {
      res.status(200).json(channels);
    })
    .catch(next);
});

router.get("/:channelId", (req, res, next) => {
  const id = req.params.channelId;
  Channels.getById(id)
    .then((channel) => {
      res.status(200).json(channel);
    })
    .catch(next);
});

module.exports = router;
