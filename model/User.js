const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email:String,
  cnic: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNo: String,
  country: String,
  password: {
    type: String,
    required: true,
  },
  refreshToken: { type: String, default: "" },
  pictures: [{ type: Schema.Types.ObjectId, ref: "Picture" }],
});

module.exports = mongoose.model("User", userSchema);
