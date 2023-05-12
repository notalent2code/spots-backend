const express = require("express");
const ownerController = require("../controllers/owner");
const { ktpUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /owners/:ownerId/info
router.get("/:ownerId/info", ownerController.getOwnerInfo);

// PUT /owners/:ownerId/info
router.put("/:ownerId/info", ktpUpload.single('ktpURL'), ownerController.updateOwnerInfo);

module.exports = router;