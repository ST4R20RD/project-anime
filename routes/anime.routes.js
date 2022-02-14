const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Anime = require("../models/anime.model");
const AnimeData = require("../AnimeData");

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
  const findAnime = Anime.findOne();
  try {
    switch (req.body.selectList) {
      case "watched":
        user.list.watched.push(anime);
      case "watching":
       if (user.list.watched.IndexOf(anime) === false) user.list.watching.push(anime);
      case "planToWatch":
        user.list.planToWatch.push(anime);
    }
    await anime.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/anime/listAnime");
  }
});

//get the animes and pass to the view listAnime
router.get("/listAnime", async (req, res) => {
  const items = await Anime.find();
  res.render("anime/listAnime", { items , img });
});



//get the anime page by parameter page number
router.get("/listAnime/page/:pageNumber", async (req, res) => {
  const pageNr = req.params.pageNumber;
  const items = await AnimeData.getAnimePage(pageNr);
  res.render("anime/listAnime", { items, pageNr });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id
  const item = await AnimeData.getAnimeData(id)
  res.render("anime/anime", { item })
})

module.exports = router;
