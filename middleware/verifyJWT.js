const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    "3cdfe16c4d89c3936dfbacbf1da0532a4f24aa2bd222052e71b215c68570159b9d846867469f4dcd23a8b7105e2458f49e277bae7c4ad0f42a2ae642c9fa78bb",
    (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid token
      req.user = decoded.UserInfo.username;
      next();
    }
  );
};

module.exports = verifyJWT;
