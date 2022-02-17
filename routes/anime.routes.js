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
        if (!isAnimeEqualTo(user.list.watched, anime)) user.list.watched.push(anime);
        if (isAnimeEqualTo(user.list.watching, anime)) user.list.watching.pop(anime);
        if (isAnimeEqualTo(user.list.planToWatch, anime)) user.list.planToWatch.pop(anime);
        break;
      case "watching":
        if (!isAnimeEqualTo(user.list.watching, anime)) user.list.watching.push(anime);
        if (isAnimeEqualTo(user.list.watched, anime)) user.list.watched.pop(anime);
        if (isAnimeEqualTo(user.list.planToWatch, anime)) user.list.planToWatch.pop(anime);
        break;
      case "planToWatch":
        if (!isAnimeEqualTo(user.list.planToWatch, anime)) user.list.planToWatch.push(anime);
        if (isAnimeEqualTo(user.list.watched, anime)) user.list.watched.pop(anime);
        if (isAnimeEqualTo(user.list.watching, anime)) user.list.watching.pop(anime);
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

router.get("/listAnime/search", async (req, res) => {
  const { searchBarInput } = req.query;
  const result = await AnimeData.searchAnime(searchBarInput);
  res.render("anime/searchResult", { result });
});

router.get("/listAnime/filter", async (req, res) => {
  const { filterAnimeList } = req.query
  console.log(`here: ${filterAnimeList} `)
  const result = await AnimeData.filterAnimeList(filterAnimeList)
  res.render("anime/filterResult", { result, filterAnimeList  })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const item = await AnimeData.getAnimeData(id);
  res.render("anime/anime", { item });
});

module.exports = router;
