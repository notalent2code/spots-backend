const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const midtransClient = require("midtrans-client");

dotenv.config();
const prisma = new PrismaClient();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const paymentBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: {
        booking_id: bookingId,
      },
      include: {
        coworking_space: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        tenant_id: booking.tenant_id,
      },
      select: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    const parameter = {
      transaction_details: {
        order_id: booking.booking_id,
        gross_amount: booking.total_price,
      },
      item_details: [
        {
          id: booking.space_id,
          price: booking.total_price,
          quantity: 1,
          name: booking.coworking_space.name,
        },
      ],
      customer_details: {
        first_name: tenant.user.first_name,
        last_name: tenant.user.last_name,
        email: tenant.user.email,
        phone: tenant.user.phone_number,
      },
    };

    const snapRes = await snap.createTransaction(parameter);

    if (!snapRes) {
      return res.status(500).json({ message: "Payment failed" });
    }

    return res.status(200).json({ snapRes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  paymentBooking,
};
