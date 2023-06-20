const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { cnic, password } = req.body;
  if (!cnic || !password)
    return res.status(400).json({ message: "Cnic and password are required." });

  const foundUser = await User.findOne({ cnic: cnic }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          cnic: foundUser.cnic,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { cnic: foundUser.cnic },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ accessToken, user: foundUser._id });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
