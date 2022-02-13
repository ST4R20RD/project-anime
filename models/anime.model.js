const mongoose = require("mongoose");

const animeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  genre: {
    type: String,
  },
  posterImage: {
    type: String,
  },
  id: {
    type: Number,
  }
});

module.exports = mongoose.model("Anime", animeSchema);
