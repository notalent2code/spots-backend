const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getTenants = async (_req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
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

    return res.status(200).json({ tenants });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOwners = async (_req, res) => {
  try {
    const owners = await prisma.owner.findMany({
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

    return res.status(200).json({ owners });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyOwner = async (req, res) => {
  const { ownerId } = req.params;
  const { ownerStatus } = req.body;

  if (
    !ownerId ||
    ownerId === "" ||
    !ownerStatus ||
    ownerStatus === "" ||
    (ownerStatus !== "APPROVED" && ownerStatus !== "REJECTED")
  ) {
    return res.status(400).json({ message: "Invalid owner information" });
  }

  let owner;

  try {
    owner = await prisma.owner.update({
      where: {
        owner_id: parseInt(ownerId),
      },
      data: {
        status: ownerStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({ owner });
};

module.exports = {
  getTenants,
  getOwners,
  verifyOwner,
};
