const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");

// Token generation
const generateToken = (user) => {
  const payload = {
    username: user.username,
    user_id: user.id,
  };

  const options = {
    expiresIn: "8h",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

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

// Login
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.getBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        const { username, id } = user;
        res
          .status(200)
          .json({
            message: `Welcome, ${user.username}!`,
            id,
            user: { id, username },
            token,
          });
      } else {
        res.status(401).json({ message: "Auth failed" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
