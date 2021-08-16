const router = require("express").Router();
const Channels = require("./channels-model");

// Get all channels
router.get("/", (req, res, next) => {
  Channels.getAll()
    .then((channels) => {
      res.status(200).json(channels);
    })
    .catch(next);
});

// Get channel by id
router.get("/:channelId", (req, res, next) => {
  const id = req.params.channelId;
  Channels.getById(id)
    .then((channel) => {
      res.status(200).json(channel);
    })
    .catch(next);
});

// Create a new channel
router.post("/", (req, res, next) => {
  Channels.add(req.body)
    .then((channel) => {
      res.status(201).json(channel);
    })
    .catch((err) => console.log(err));
});

// Delete a channel
router.delete("/:channelId", (req, res, next) => {
  id = req.params.channelId;
  Channels.remove(id)
    .then((channel) => {
      res.status(200).json(channel);
    })
    .catch(next);
});

module.exports = router;
