const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  checkAuth,
  (req, res, next) => {
    // console.log(req.body);
    const url = req.protocol + "://" + req.get("host");
    let imagePath;
    if (req.file) {
      // console.log("no file");
      if (req.file.filename) {
        imagePath = url + "/images/" + req.file.filename;
      }
    }
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      imagePath: imagePath,
      creator: req.userData.userId,
      goal: req.body.goal,
      wordCount: [
        { count: req.body.wordCount, date: new Date().toDateString() },
      ],
      yearWritten: req.body.yearWritten,
    });
    console.log(post);
    post
      .save()
      .then((createdPost) => {
        // console.log(createdPost)
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: createdPost._id,
            title: createdPost.title,
            description: createdPost.description,
            imagePath: createdPost?.imagePath,
            goal: createdPost.goal,
            wordCount: createdPost.wordCount,
            yearWritten: createdPost.yearWritten,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Creating a post failed",
        });
      });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      imagePath: imagePath,
      creator: req.userData.userId,
      goal: req.body.goal,
      wordCount: req.body.wordCount,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then((result) => {
        // console.log(result);
        if (result.modifiedCount > 0) {
          res.status(200).json({
            message: "success",
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
  }
);

router.get("", (req, res, next) => {
  const postQuery = Post.find();
  let fetchedPosts;
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      // console.log(fetchedPosts)
      return Post.count();
    })
    .then((count) => {
      // console.log(fetchedPosts)
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Post deleted!" });
      } else {
        res.status(200).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Delete failed!",
      });
    });
});

module.exports = router;
