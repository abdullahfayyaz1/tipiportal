const Parcel = require("../model/Parcel");
const Picture = require("../model/Picture");

const handleNewParcel = async (req, res) => {
  console.log("HAH");
  const {
    timeToDeliver,
    commission,
    title,
    description,
    value,
    pickupLocation,
    destination,
    senderPhoneNO,
    receiverPhoneNO,
    estDimension,
  } = req.body;

  console.log(estDimension);

  if (
    !pickupLocation ||
    !(value + 2) ||
    !destination ||
    !senderPhoneNO ||
    !receiverPhoneNO ||
    !estDimension
  ) {
    return res.status(400).json({ message: "Fill all the fields." });
  }

  const pictureIds = [];

  if (req.files && req.files.length > 0) {

    // Iterate through each uploaded picture
    for (const file of req.files) {
      const { filename, path, mimetype } = file;

      // Create a new picture with user reference
      const picture = new Picture({
        filename,
        contentType: mimetype,
        path,
      });

      // Save the picture to the database
      await picture.save();

      // console.log(picture);

      pictureIds.push(picture);
    }
  }

  try {
    const result = await Parcel.create({
      timeToDeliver,
      commission,
      title,
      description,
      value,
      pickupLocation,
      destination,
      senderPhoneNO,
      receiverPhoneNO,
      estDimension: {
        height: 100,
        width: estDimension.width,
        weight: estDimension.weight,
      },
      pictures: pictureIds,
    });

    res.status(201).send({ success: `New Parcel ${result} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllParcels = async (req, res) => {
  const Parcels = await Parcel.find();
  if (!Parcels) return res.status(204).json({ message: "No Parcels found." });
  res.json(Parcels);
};

module.exports = { handleNewParcel, getAllParcels };
