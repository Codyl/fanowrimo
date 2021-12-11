const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      families: []
    });
    user
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "user created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
            message: "Invalid authentication credentials!"
        });
      });
  });
});
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      //We do not have this email in the database of users.
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      fetchedUser = user;
      //We have the same user
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "super_secret_private_key_uncrackable_long_string",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      });
    });
});

router.put("/addToFamily", (req, res, next) => {
  // const newUser = req.body.user;
  // const family = req.body.family;
  console.log(req.body, "puttest");
  // User.updateOne(
  //   { name: family.name, code: family.code },
  //   {
  //     members: [...family.members, newUser],
  //   }
  // )
  //   .then((result) => {
  //     console.log(result, "result");
  //     if (result.modifiedCount > 0) {
  //       res.status(200).json({
  //         message: "success",
  //       });
  //     } else {
  //       res.status(401).json({
  //         message: "Not Authorized",
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       message: "Couldn't update post!",
  //     });
  //   });
});
router.get("", (req, res, next) => {console.log('??')});
module.exports = router;
