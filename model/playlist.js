const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  emotion: String,
  playlist_id: String,
});
module.exports = mongoose.model("Playlist", playlistSchema);