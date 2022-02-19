const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { isLoggedIn } = require("../middlewares/guard");

const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("user/signin");
});

router.post("/signin", async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.favoriteAnime = req.body.favoriteAnime;
  user.favoriteAnimeWebsite = req.body.favoriteAnimeWebsite
  try {
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.redirect("/user/login");
  } catch (error) {
    res.redirect("/user/signin");
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isPwCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isPwCorrect) {
      req.session.currentUser = user;
      res.redirect("/user/profile");
    } else {
      res.redirect("/user/login");
    }
  } catch (error) {
    console.log(error)
    res.redirect("/user/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});

router.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  console.log(user.list.watching)
  res.render("user/profile", { user });
});

router.get("/profile/:listOption", async (req, res) => {
  const listOp = req.params.listOption;
  const user = req.session.currentUser;
  const list = user.list[listOp];
  res.render("user/list", { user, list })
})

module.exports = router;
