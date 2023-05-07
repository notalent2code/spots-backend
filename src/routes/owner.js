const express = require("express");
const verifyToken = require("../middlewares/auth");
const ownerController = require("../controllers/owner");
const upload = require("../utils/uploadImage");

const router = express.Router();

// GET /owners/:ownerId/info
router.get("/:ownerId/info", verifyToken, upload.single('ktpURL'), ownerController.getOwnerInfo);