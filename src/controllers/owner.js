const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const ownerInfo = async (req, res) => {
  const { ownerId } = req.params;

  const owner = await prisma.owner.findUnique({
    where: {
      owner_id: parseInt(ownerId),
    },
    include: {
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
        },
      },
    },
  });
  console.log(owner);

  return owner;
};

const getOwnerInfo = async (req, res) => {
  try {
    const owner = await ownerInfo(req, res);

    console.log(owner);

    if (req.user.userId !== owner.user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({ owner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOwnerInfo = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      nik,
      bankName,
      cardNumber,
    } = req.body;
    const ktpFileName = req.file ? req.file.filename : null;
    const { ownerId } = req.params;

    const ktpURL = `${process.env.API_DOMAIN}/uploads/ktp/${ktpFileName}`;

    let updatedOwner = await ownerInfo(req, res);

    console.log(updatedOwner);

    if (req.user.userId !== updatedOwner.user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    if (
      updatedOwner.ktp_picture !== null && ktpFileName !== null
    ) {
      const oldKtp = updatedOwner.ktp_picture.split("/uploads/ktp/")[1];
      fs.unlinkSync(path.join(__dirname, `../uploads/ktp/${oldKtp}`));
    }

    if (email && email !== updatedOwner.user.email) {
      const emailExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExist) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    updatedOwner = await prisma.owner.update({
      where: {
        owner_id: parseInt(ownerId),
      },
      data: {
        ktp_picture: ktpURL || updatedOwner.ktp_picture,
        nik: nik || updatedOwner.nik,
        bank_name: bankName || updatedOwner.bank_name,
        card_number: cardNumber || updatedOwner.card_number,
        user: {
          update: {
            email: email || updatedOwner.user.email,
            first_name: firstName || updatedOwner.user.first_name,
            last_name: lastName || updatedOwner.user.last_name,
            phone_number: phoneNumber || updatedOwner.user.phone_number,
          },
        },
      },
    });

    return res.status(200).json({ updatedOwner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOwnerInfo,
  updateOwnerInfo,
};