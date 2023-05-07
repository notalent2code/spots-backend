const express = require("express");
const verifyToken = require("../middlewares/auth");
const ownerController = require("../controllers/owner");
const { ktpUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /owners/:ownerId/info
router.get("/:ownerId/info", verifyToken, ownerController.getOwnerInfo);

// PUT /owners/:ownerId/info
router.put("/:ownerId/info", verifyToken, ktpUpload.single('ktpURL'), ownerController.updateOwnerInfo);

module.exports = router;