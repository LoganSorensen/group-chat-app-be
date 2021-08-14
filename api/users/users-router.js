const router = require("express").Router();
const Users = require("./users-model");

// Get all users
router.get("/", (req, res, next) => {
  Users.getAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

// Get user by id
router.get("/:userId", (req, res, next) => {
  Users.getById(req.params.userId)
    .then((user) => {
      if (user) {
        const { password, ...userObject } = user;
        res.status(200).json(userObject);
      } else {
        res.status(404).json("The user with the specified id does not exist.");
      }
    })
    .catch(next);
});

module.exports = router;
