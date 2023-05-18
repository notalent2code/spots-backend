const express = require("express");
const bookingController = require("../controllers/booking");
const verifyAuth = require("../middlewares/auth");
const verifyTenant = require("../middlewares/tenant");

const router = express.Router();

// POST /bookings/:spaceId/book
router.post("/:spaceId/book", verifyAuth, verifyTenant, bookingController.bookCoworkingSpace);

// GET /bookings/?order_id
router.get("/", verifyTenant, bookingController.callbackBookingDetail);

module.exports = router;