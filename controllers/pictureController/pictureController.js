const Picture = require("../../model/Picture");
const User = require("../../model/User");
const mypath = require("path");
const fs = require("fs");

const handleNewPicture = async (req, res) => {
  if (!req?.params?.userId)
    return res.status(400).json({ message: "User ID required" });

  const userId = req.params.userId;

  let pictureId;

  if (req.file && req.file.size > 0) {
    const { filename, path, mimetype } = req.file;

    // Create a new picture with user reference
    const picture = new Picture({
      filename,
      contentType: mimetype,
      path,
      user: userId,
    });

    await picture.save();
    pictureId = picture._id;
  }

  if (!pictureId) res.status(404).json({ message: "No picture" });

  try {
    // saving picture id to User's picture
    const user = await User.findById(req.params.userId);
    user.pictures.push(pictureId);
    await user.save();

    res.status(201).send({ success: `New Picture created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPictures = async (req, res) => {
  if (!req?.params?.userId)
    return res.status(400).json({ message: "User ID required" });
// finding pics for respected user
  let pictures = await Picture.find({ user: req.params.userId }).exec();
  // console.log(pictures)

  //   const pictures = await Picture.find(req.paramas.userId);
  if (!pictures || pictures.length === 0) {
    return res.status(204).json({ message: "No Pictures found." });
  }

  // Read each image file, encode as Base64, and include it in the response
  pictures = pictures.map((item) => {
    const imageBase64 = fs.readFileSync(item.path, { encoding: "base64" });

    return {
      user: item.user,
      path: item.path,
      createdAt: item.createdAt,
      imageData: imageBase64,
    };
  });

  res.json({ pictures });
};

module.exports = { getAllPictures, handleNewPicture };
