const express = require("express");
const coworkingController = require("../controllers/coworkingSpace");
const verifyAuth = require("../middlewares/auth");
const verifyOwner = require("../middlewares/owner");
const { coworkingUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /coworking-space
router.get("/", coworkingController.getCoworkingSpaces);

// GET /coworking-space/:spaceId
router.get("/:spaceId", coworkingController.getCoworkingSpaceById);

// // POST /coworking-space
router.post("/", verifyAuth, verifyOwner, coworkingUpload.array('spaceURLs', 10), coworkingController.addCoworkingSpace);

// PUT /coworking-space/:spaceId
router.put("/:spaceId", verifyAuth, verifyOwner, coworkingUpload.array('spaceURLs', 10), coworkingController.updateCoworkingSpace);

module.exports = router;