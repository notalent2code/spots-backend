const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

// GET /admin/tenants
router.get("/tenants", adminController.getTenants);

// GET /admin/owners
router.get("/owners", adminController.getOwners);

// PUT /admin/owners/:ownerId/verify
router.put("/owners/:ownerId/verify", adminController.verifyOwner);


module.exports = router;