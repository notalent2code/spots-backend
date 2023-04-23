const { PrismaClient } = require("@prisma/client");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json("Hello World!");
});

router.post("/register", async function (req, res, next) {
  const { email, passwordHash, firstName, lastName, phoneNumber, userType } = req.body;
  console.log()
  const prisma = new PrismaClient();
  const user = await prisma.users.create({
    data: req.body,
  });

  res.status(201).json({
    "msg": "User registered successfully",
    "user": user
  });
});

module.exports = router;
