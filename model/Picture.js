const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  filepath: {
    type: String,
  },
  path: String,
  contentType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Picture", pictureSchema);
