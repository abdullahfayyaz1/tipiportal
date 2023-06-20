const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb+srv://abdullahfayyaz003:3vVQ3rFPrQcD6SxU@tipiclustor.usfogji.mongodb.net/TIPIDatabase?retryWrites=true&w=majority", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
