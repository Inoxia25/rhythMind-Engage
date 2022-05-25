const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  emotion: String,
  song_id: String,
});
module.exports = mongoose.model("Song", songSchema);