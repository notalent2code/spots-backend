const express = require("express");
const verifyAuth = require("../middlewares/auth");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to Spots API" });
});

router.get("/test-auth", verifyAuth, (req, res, next) => {
  res.status(200).json({ message: 'Authentication testing success' });
});

module.exports = router;
