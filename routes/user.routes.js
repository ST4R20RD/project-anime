const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const router = express.Router();

router.get("/signin", (req, res) => {
    res.render("user/signin");
  });

module.exports = router;