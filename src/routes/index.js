const express = require("express");
const verifyAuth = require("../middlewares/auth");

const router = express.Router();

/* GET home page. */
router.get("/", verifyAuth, (req, res, next) => {
  res.status(200).json("Landing Page of Spots");
});

module.exports = router;
