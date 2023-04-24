const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");


// POST /auth/register
router.post("/register", authController.register);

// POST /auth/login
router.post("/login", authController.login);

// DELETE /auth/logout
router.delete("/logout", authController.logout);

// GET /auth/refresh-token
router.get("/refresh-token", authController.refreshToken);

module.exports = router;