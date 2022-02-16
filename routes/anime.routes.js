const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const { isAnimeEqualTo } = require("../routes/utils/isAnimeEqualTo")
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
  const findAnime = Anime.findOne();
});

//get the animes and pass to the view listAnime
router.get("/listAnime", async (req, res) => {
  const items = await Anime.find();
  res.render("anime/listAnime", { items });
});

router.get("/addToList/:id/:listOption", async (req, res) => {
  const listOp = req.params.listOption;
  const user = req.session.currentUser;
  const animeId = req.params.id;
  const anime = await AnimeData.getAnimeData(animeId);
  try {
    switch (listOp) {
      case "watched":
        if (!isAnimeEqualTo(user.list.watched, anime)) {
          console.log("im here")
          user.list.watched.push(anime);
        }
        break;
      case "watching":
        if (!isAnimeEqualTo(user.list.watching, anime)) {
          user.list.watching.push(anime);
        }
        break;
      case "planToWatch":
        if (!isAnimeEqualTo(user.list.planToWatch, anime)) {
          user.list.planToWatch.push(anime);
        }
    }
    res.redirect(`/anime/${animeId}`);
  } catch (error) {
    res.redirect(`/anime/${animeId}`);
  }
});

//get the anime page by parameter page number
router.get("/listAnime/page/:pageNumber", async (req, res) => {
  const pageNr = req.params.pageNumber;
  const items = await AnimeData.getAnimePage(pageNr);
  res.render("anime/listAnime", { items, pageNr });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const item = await AnimeData.getAnimeData(id);
  res.render("anime/anime", { item });
});

module.exports = router;
