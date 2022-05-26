const mongoose = require("mongoose");

const moodSchema = mongoose.Schema({
    anger: Number,
    contempt:Number,
   disgust :Number,
    fear:Number,
    happiness:Number,
    neutral:Number,
    sadness:Number,
    surprise:Number,
  });
const emotionSchema = new mongoose.Schema({
  emotion: moodSchema,
  date: String
});
module.exports = mongoose.model("Emotion", emotionSchema);