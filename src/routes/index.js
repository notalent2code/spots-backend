const express = require("express");
const verifyAuth = require("../middlewares/auth");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(200).json("Landing page of Spots");
});

router.get("/test-auth", verifyAuth, (req, res, next) => {
  res.status(200).json("Authentication test success");
});

module.exports = router;
