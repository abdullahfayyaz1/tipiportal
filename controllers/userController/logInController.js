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
    
    // create JWT token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          cnic: foundUser.cnic,
        },
      },
      "3cdfe16c4d89c3936dfbacbf1da0532a4f24aa2bd222052e71b215c68570159b9d846867469f4dcd23a8b7105e2458f49e277bae7c4ad0f42a2ae642c9fa78bb",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { cnic: foundUser.cnic },
      "c990dd3b65fd0a717fade455c18f6ec694d07b66b49baa3476292b9e94ff334e895a90fa51d5fd7fd631292913af196965c5e4a494249ada6350fb6f8b42ce51",
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

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
