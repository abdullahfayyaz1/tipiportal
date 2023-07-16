const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllPictures,     //import where pictures are present
  handleNewPicture,
} = require("../controllers/pictureController/pictureController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId; // Get the user ID from the request parameters or wherever it's available
    const userFolderPath = path.join("pictures", userId); // Create a folder path specific to the user

    // crete folder if it does not exists
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }
    cb(null, userFolderPath); // Pass the folder path to multer as the destination
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original file extension
    const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });
//routes tell when to start which function 
router
  .route("/users/:userId/pictures")
  .post(upload.single("picture"), handleNewPicture)
  .get(getAllPictures);

module.exports = router;
