const mongoose = require("mongoose");

const animeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
  },
});
