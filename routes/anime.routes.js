const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const { isAnimeEqualTo } = require("../routes/utils/isAnimeEqualTo")
const Anime = require("../models/anime.model");
const AnimeData = require("../AnimeData");

const User = require("../models/user.model");

const router = express.Router();

//get the animes and pass to the view listAnime
router.get("/listAnime", async (req, res) => {
  const items = await Anime.find();
  res.render("anime/listAnime", { items });
});

router.get("/addList/:id/:listOption", async (req, res) => {
  const listOp = req.params.listOption;
  const user = await User.findById(req.session.currentUser._id);
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
    await user.save();
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
  const item = await AnimeData.getAnimeData(req.params.id);
  if (req.session.currentUser) {
    const user = await User.findById(req.session.currentUser._id).populate("friends");
    const friends = user.friends;
    res.render("anime/anime", { item , friends, user});
    return
  }
  let user = false
  res.render("anime/anime", { item, user })
});

module.exports = router;
