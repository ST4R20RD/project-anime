const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteAnime: {
    type: String,
  },
  favoriteAnimeWebsite: {
    type: String,
  },
  list: {
    watched: [],
    watching: [],
    planToWatch: [],
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

module.exports = mongoose.model("User", userSchema);
