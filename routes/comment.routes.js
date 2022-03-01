const express = require("express");
const Comment = require("../models/comment.model");
const comments = require("../models/comment.model");
const { isLoggedIn } = require("../middlewares/guard");
const AnimeData = require("../AnimeData")

const router = express.Router();

router.post("/:id", isLoggedIn, async (req, res) => {
  const user = req.session.currentUser;
  const comment = new Comment();
  comment.animeId = req.params.id;
  comment.content = req.body.content;
  comment.author = user._id;
  await comment.save();
  res.redirect(`/anime/${req.params.id}`);
});

module.exports = router;
