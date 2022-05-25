const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  spotify_id: String,
  access_token:String,
  refresh_token: String,
  //email: String,
  liked_songs: [
    {
      type: mongoose.Schema.Types.ObjectId, //reference to embed id of song schema
      ref: "Song", //the model name
    },
  ],
  liked_playlists: [
      { type: mongoose.Schema.Types.ObjectId,
         ref: "Playlist"
      }
    ],
  emotions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emotion", 
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
