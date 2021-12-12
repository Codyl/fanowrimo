const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      families: [],
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "user created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
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
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userFamilies: fetchedUser.families,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      });
    });
});

router.put("", (req, res, next) => {
  if (req.body.userFamilies.includes(req.body.family.id)) {
    return res.status(200).json({
      message: "already exists on user",
      families: req.body.userFamilies,
    });
  }
  User.updateOne(
    { _id: req.body.userId },
    {
      families: [...req.body.userFamilies, req.body.family.id],
    }
  )
    .then((result) => {
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          message: "success",
          families: [...req.body.userFamilies, req.body.family.id],
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
});

router.get("/names", (req, res, next) => {
  //We have the user ids now we need the names
  const userQuery = User.find();
  userQuery.then((users) => {
    const names = users.map((user) => {
      return { id: user._id, username: user.name };
    });
    res.status(200).json({
      names: names,
    });
  });
});
module.exports = router;
