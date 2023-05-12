const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).send("Access denied");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send("Invalid token");
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = verifyAuth;
