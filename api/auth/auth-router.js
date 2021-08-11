const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");

// Register
router.post("/register", (req, res) => {
  const username = req.body.username;

  // checks if the username has been taken
  Users.getBy({ username })
    .then((user) => {
      if (user.length > 0) {
        res.status(409).json({
          message: "This username has been taken",
        });
      } else {
        // password hashing
        let user = req.body;
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;

        // adding the user to the database
        Users.add(user)
          .then((user) => {
            console.log(user);
            res.status(201).json("user added");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
