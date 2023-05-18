const express = require("express");
const paymentController = require("../controllers/payment");
const verifyOwner = require("../middlewares/owner");
const verifyTenant = require("../middlewares/tenant");

const router = express.Router();

// POST /payment/booking
router.post("/booking", verifyTenant, paymentController.paymentBooking);

// // POST /payment/withdrawal
// router.post("/withdrawal", verifyOwner, paymentController.paymentWithdrawal);

module.exports = router;