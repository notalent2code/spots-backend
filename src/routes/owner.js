const express = require("express");
const verifyToken = require("../middlewares/auth");
const ownerController = require("../controllers/owner");
const upload = require("../utils/uploadImage");

const router = express.Router();

// GET /owners/:ownerId/profile
router.get("/:ownerId/profile", verifyToken, ownerController.getOwnerProfile);