const express = require("express");
const verifyToken = require("../middlewares/auth");
const router = express.Router();

/* GET home page. */
router.get("/", verifyToken, (req, res, next) => {
  res.status(200).json("Landing Page of Spots");
});

module.exports = router;
