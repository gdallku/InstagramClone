const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

router.get("/allpost", (req,res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/createpost", authentication, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "Please add all your fields" });
  }
  // console.log(req.user)
  // console.log('ok')
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost",authentication, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
