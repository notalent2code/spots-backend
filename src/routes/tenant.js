const express = require("express");
const tenantController = require("../controllers/tenant");
const { avatarUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /tenants/:tenantId/profile
router.get("/:tenantId/profile", tenantController.getTenantProfile);

// PUT /tenants/:tenantId/profile
router.put("/:tenantId/profile", avatarUpload.single('avatarURL'), tenantController.updateTenantProfile);

module.exports = router;