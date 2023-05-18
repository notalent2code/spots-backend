const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const { Base64 } = require("js-base64");
const { isValidBooking } = require("../utils/bookingValidator");

dotenv.config();
const prisma = new PrismaClient();

const bookCoworkingSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    let { date, startHour, endHour, totalPrice } = req.body;

    startHour = parseInt(startHour);
    endHour = parseInt(endHour);
    totalPrice = parseInt(totalPrice);

    const tenant = await prisma.tenant.findUnique({
      where: {
        user_id: parseInt(req.user.userId),
      },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const coworkingSpace = await prisma.coworkingSpace.findUnique({
      where: {
        space_id: parseInt(spaceId),
      },
    });

    if (!coworkingSpace) {
      return res.status(404).json({ message: "Coworking space not found" });
    }

    const availability = await prisma.availability.findMany({
      where: {
        space_id: parseInt(spaceId),
        date: date,
      },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    const validBooking = (availability) => {
      return isValidBooking(date, startHour, endHour, availability);
    };

    if (!validBooking(availability)) {
      return res.status(400).json({ message: "Invalid booking" });
    }

    const booking = await prisma.booking.create({
      data: {
        space_id: coworkingSpace.space_id,
        tenant_id: tenant.tenant_id,
        date: date,
        start_hour: startHour,
        end_hour: endHour,
        total_price: totalPrice,
      },
    });

    const newAvailability = await prisma.availability.create({
      data: {
        space_id: coworkingSpace.space_id,
        date: date,
        start_hour: startHour,
        end_hour: endHour,
        is_booked: true,
      },
    });

    if (!booking || !newAvailability) {
      return res.status(400).json({ message: "Failed to book" });
    }

    const responseData = {
      booking: booking,
      coworkingSpace: {
        name: coworkingSpace.name,
        price: coworkingSpace.price,
        capacity: coworkingSpace.capacity,
      },
    };

    return res
      .status(200)
      .json({ message: "Book success", data: responseData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getMidtransPaymentStatus = async (bookingId, req, res) => {
  try {
    const paymentStatus = await fetch(
      `https://api.sandbox.midtrans.com/v2/${bookingId}/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Base64.encode(
            `${process.env.MIDTRANS_SERVER_KEY}:`
          )}`,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    if (!paymentStatus) {
      console.log("Payment not found");
    }

    return paymentStatus;
  } catch (error) {
    console.log(error);
  }
};

const callbackBookingDetail = async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const status = await getMidtransPaymentStatus(order_id, req, res);

    if (!status) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let payment = await prisma.payment.findUnique({
      where: {
        payment_id: status.transaction_id,
      },
    });

    let owner;
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          payment_id: status.transaction_id,
          method: status.payment_type,
          amount: parseInt(status.gross_amount),
          status: status.transaction_status,
          booking: {
            connect: {
              booking_id: order_id,
            },
          },
        },
      });

      if (payment.status === "settlement") {
        const booking = await prisma.booking.findUnique({
          where: {
            booking_id: payment.booking_id,
          },
          include: {
            coworking_space: true,
          },
        });

        owner = await prisma.coworkingSpace.update({
          where: {
            space_id: booking.space_id,
          },
          data: {
            owner: {
              update: {
                balance: {
                  increment: payment.amount,
                },
              },
            },
          },
        });
      }
    }

    const booking = await prisma.booking.findUnique({
      where: {
        booking_id: order_id,
      },
      include: {
        coworking_space: {
          select: {
            name: true,
          },
        },
        payment: {
          select: {
            payment_id: true,
            method: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookCoworkingSpace,
  callbackBookingDetail,
};
