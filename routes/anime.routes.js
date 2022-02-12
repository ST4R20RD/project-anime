const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Anime = require("../models/anime.model");

const User = require("../models/user.model");

const router = express.Router();

router.get("/create", (req, res) => {
  res.render("anime/createAnime");
});

router.post("/create", isLoggedIn, async (req, res) => {
  const anime = new Anime();
  anime.name = req.body.name;
  anime.genre = req.body.genre;
  const user = req.session.currentUser;
  const findAnime = Anime.findOne()
  try {
    switch (req.body.selectList) {
      case "watched":
        user.list.watched.push(anime._id);
      case "watching":
        user.list.watching.push(anime._id)
      case "planToWatch":
        user.list.planToWatch.push(anime._id)
    }
    await anime.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/anime/create");
  }
});

module.exports = router;
