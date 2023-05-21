const express = require("express");
const ownerController = require("../controllers/owner");
const { ktpUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /owners/info
router.get("/info", ownerController.getOwnerInfo);

// PUT /owners/info
router.put("/info", ktpUpload.single('ktpURL'), ownerController.updateOwnerInfo);

module.exports = router;