const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

// GET /admin/tenants
router.get("/tenants", adminController.getTenants);

// GET /admin/owners
router.get("/owners", adminController.getOwners);

// PUT /admin/owners/:ownerId/verify
router.put("/owners/:ownerId/verify", adminController.verifyOwner);

// PUT /admin/coworking-space/:spaceId/verify
router.put("/coworking-space/:spaceId/verify", adminController.verifyCoworkingSpace);

module.exports = router;