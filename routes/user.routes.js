const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { isLoggedIn } = require("../middlewares/guard");
const { isUserEqualTo } = require("./utils/isUserEqualTo");

const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("user/signin");
});

router.post("/signin", async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
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
    console.log(error);
    res.redirect("/user/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  res.render("user/profile", { user });
});

router.get("/profile/:listOption", async (req, res) => {
  const listOp = req.params.listOption;
  const user = await User.findById(req.session.currentUser._id);
  const list = user.list[listOp];
  res.render("user/list", { user, list });
});

router.get("/friends", async (req, res) => {
  const user = await User.findById(req.session.currentUser._id).populate("friends");
  const friends = user.friends;
  res.render("friend/friends", { friends });
});

router.get("/friends/search", async (req, res) => {
  const { searchBarInput } = req.query;
  const result = await User.find({ username: `${searchBarInput}` });
  res.render("friend/friendsResults", { result });
});

router.get("/friends/:id/add", async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  const friend = await User.findById(req.params.id);
  try {
    if (!isUserEqualTo(user.friends, friend)) {
      user.friends.push(friend._id);
    }
    user.save();
    res.redirect("/user/friends")
  } catch (error) {
    console.log(error);
  }
});

router.get("/friendProfile/:id", async (req, res) => {
  const friend = await User.findById(req.params.id);
  res.render("friend/friendProfile", { friend })
})

module.exports = router;
