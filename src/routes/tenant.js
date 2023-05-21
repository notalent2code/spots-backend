const express = require("express");
const tenantController = require("../controllers/tenant");
const { avatarUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /tenants/profile
router.get("/profile", tenantController.getTenantProfile);

// PUT /tenants/profile
router.put("/profile", avatarUpload.single('avatarURL'), tenantController.updateTenantProfile);

module.exports = router;