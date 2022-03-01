const mongoose = require("mongoose");

const animeSchema = mongoose.Schema({
  id: {
    type: Number,
  },
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "Comment",
  },
});

module.exports = mongoose.model("Anime", animeSchema);
