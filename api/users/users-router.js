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

// Update user info
router.put("/:userId", (req, res, next) => {
  const { userId } = req.params;
  const { username } = req.body;

  if (username) {
    Users.getBy({ username })
      .then((user) => {
        if (user.length > 0 && user[0].id != userId) {
          res.status(409).json({ message: "Username already exists" });
        } else {
          Users.modify(userId, req.body)
            .then((updatedUser) => {
              res.status(200).json(updatedUser);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  } else {
    Users.modify(userId, req.body)
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
