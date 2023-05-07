const express = require("express");
const verifyToken = require("../middlewares/auth");
const tenantController = require("../controllers/tenant");
const { avatarUpload } = require("../utils/uploadImage");

const router = express.Router();

// GET /tenants/:tenantId/profile
router.get("/:tenantId/profile", verifyToken, tenantController.getTenantProfile);

// PUT /tenants/:tenantId/profile
router.put("/:tenantId/profile", verifyToken, avatarUpload.single('avatarURL'), tenantController.updateTenantProfile);

module.exports = router;