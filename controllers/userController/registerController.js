const User = require("../../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { email, password, name, cnic, phone, country } = req.body;
  if (!cnic || !password)
    return res
      .status(400)
      .json({ message: "Cnic and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ cnic: cnic }).exec();
  if (duplicate) return res.status(409).send("User already exits!"); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      email,
      password: hashedPwd,
      name,
      cnic,
      country,
      phoneNo: phone
    });

    res.status(201).send({ success: `New user ${result} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
