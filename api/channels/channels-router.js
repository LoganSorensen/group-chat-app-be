const router = require("express").Router();
const Channels = require("./channels-model");

router.get("/", (req, res, next) => {
  Channels.getAll()
    .then((channels) => {
      res.status(200).json(channels);
    })
    .catch(next);
});

module.exports = router;
