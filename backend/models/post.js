const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  wordCount: [{count: Number, date: String}],
  goal: { type: Number },
  yearWritten: { type: Number },
  imagePath: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
