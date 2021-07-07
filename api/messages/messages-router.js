const router = require("express").Router();
const Messages = require("./messages-model");

router.get("/", (req, res, next) => {
  Messages.getAll()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(next);
});

module.exports = router;
