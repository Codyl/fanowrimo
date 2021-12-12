const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Family = require("../models/family");
router.post("", checkAuth, (req, res, next) => {
  // const url = req.protocol + "://" + req.get("host");
  const family = new Family({
    name: req.body.name,
    code: req.body.code,
    members: req.body.members,
  });
  family
    .save()
    .then((createdFamily) => {
      res.status(201).json({
        message: "Family added successfully",
        family: {
          name: createdFamily.name,
          code: createdFamily.code,
          members: createdFamily.members,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed",
      });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const newUser = req.body.user;
  const family = req.body.family;
  Family.updateOne(
    { name: family.name, code: family.code },
    {
      members: [...family.members, newUser]

    }
  )
    .then((result) => {
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
});

router.post("/myFamilies", (req, res, next) => {

  const familyQuery = Family.find({ _id: { "$in" : req.body.ids }});
  familyQuery
    .then((families) => {
      return res.status(200).json({
        message: "Families fetched successfully!",
        families: families,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching families failed!",
      });
    });
});
router.post("/request", (req, res, next) => {
  let fetchedfamily;
  Family.findOne({ name: req.body.name, code: req.body.code })
    .then((family) => {
      //We do not have this email in the database of familys.
      if (!family) {
        return res.status(401).json({
          message: "Find family failed",
        });
      }
      fetchedfamily = family;
      res.status(200).json({
        id: fetchedfamily._id,
        members: fetchedfamily.members,
        name: fetchedfamily.name,
        code: fetchedfamily.code
      })
    }).catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      })
    })
});



// router.delete("/:id", checkAuth, (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
//     .then((result) => {
//       if (result.modifiedCount > 0) {
//         res.status(200).json({ message: "Post deleted!" });
//       } else {
//         res.status(200).json({ message: "Not Authorized" });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Delete failed!",
//       });
//     });
// });

module.exports = router;
