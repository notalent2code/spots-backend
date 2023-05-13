const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const getCoworkingSpaces = async (req, res) => {
  try {
    const coworkingSpaces = await prisma.coworkingSpace.findMany({
      include: {
        owner: {
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
        },
        location_id: true,
        availabilities: true,
        coworking_space_images: true,
        coworking_space_facilities: true,
      },
    });
    return res.status(200).json({ coworkingSpaces });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addCoworkingSpace = async (req, res) => {
  try {
    const verifiedOwner = await prisma.owner.findUnique({
      where: {
        user_id: parseInt(req.user.userId),
      },
    });

    if (!verifiedOwner || verifiedOwner.status != "APPROVED") {
      return res.status(403).json({ message: "Please verify your account" });
    }

    const {
      name,
      description,
      price,
      capacity,
      address,
      latitude,
      longitude,
      facilities,
    } = req.body;

    if (req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const resCoworkingSpace = await prisma.coworkingSpace.create({
      data: {
        name,
        description,
        price: parseInt(price),
        capacity: parseInt(capacity),
        owner_id: verifiedOwner.owner_id,
      },
    });

    if (!resCoworkingSpace) {
      return res.status(400).json({ message: "Failed to add coworking space" });
    }

    const resLocation = await prisma.location.create({
      data: {
        space_id: resCoworkingSpace.space_id,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    if (!resLocation) {
      return res.status(400).json({ message: "Failed to add location" });
    }

    const reqImages = req.files.map((file) => {
      return {
        space_id: resCoworkingSpace.space_id,
        image_url: `${process.env.API_DOMAIN}/uploads/coworking_space/${file.filename}`,
      };
    });

    const images = await prisma.coworkingSpaceImage.createMany({
      data: reqImages,
    });

    if (!images) {
      return res.status(400).json({ message: "Failed to add images" });
    }

    const resImages = await prisma.coworkingSpaceImage.findMany({
      where: {
        space_id: resCoworkingSpace.space_id,
      },
    });

    const reqFacilities = facilities.split(",").map((facility) => {
      return {
        id: facility,
      };
    });

    for (let i = 0; i < reqFacilities.length; i++) {
      const facility = await prisma.facility.findUnique({
        where: {
          facility_id: parseInt(reqFacilities[i].id),
        },
      });

      if (!facility) {
        return res.status(400).json({ message: "Facility not found" });
      }

      await prisma.coworkingSpaceFacility.create({
        data: {
          space_id: resCoworkingSpace.space_id,
          facility_id: facility.facility_id,
        },
      });
    }

    const resFacilities = await prisma.coworkingSpaceFacility.findMany({
      where: {
        space_id: resCoworkingSpace.space_id,
      },
      include: {
        facility: true,
      },
    });

    return res.status(201).json({
      message: "Add coworking space success",
      coworkingSpace: resCoworkingSpace,
      location: resLocation,
      images: resImages,
      facilities: resFacilities,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCoworkingSpace = async (req, res) => {
  try {
    const verifiedOwner = await prisma.owner.findUnique({
      where: {
        user_id: parseInt(req.user.userId),
      },
    });

    if (!verifiedOwner || verifiedOwner.status != "APPROVED") {
      return res.status(403).json({ message: "Please verify your account" });
    }

    const coworkingSpace = await prisma.coworkingSpace.findUnique({
      where: {
        owner_id: verifiedOwner.owner_id,
        space_id: parseInt(req.params.spaceId),
      },
    });

    if (!coworkingSpace) {
      return res.status(404).json({ message: "Coworking space not found" });
    }

    const {
      name,
      description,
      price,
      capacity,
      address,
      latitude,
      longitude,
      facilities,
    } = req.body;

    const resCoworkingSpace = await prisma.coworkingSpace.update({
      where: {
        space_id: coworkingSpace.space_id,
      },
      data: {
        name: name || coworkingSpace.name,
        description: description || coworkingSpace.description,
        price: parseInt(price) || coworkingSpace.price,
        capacity: parseInt(capacity) || coworkingSpace.capacity,
      },
    });

    if (!resCoworkingSpace) {
      return res
        .status(400)
        .json({ message: "Failed to edit coworking space" });
    }

    const resLocation = await prisma.location.update({
      where: {
        space_id: coworkingSpace.space_id,
      },
      data: {
        address: address || coworkingSpace.address,
        latitude: parseFloat(latitude) || coworkingSpace.latitude,
        longitude: parseFloat(longitude) || coworkingSpace.longitude,
      },
    });

    if (!resLocation) {
      return res.status(400).json({ message: "Failed to edit location" });
    }

    let resImages;

    if (req.files.length > 0) {
      const reqImages = req.files.map((file) => {
        return {
          space_id: coworkingSpace.space_id,
          image_url: `${process.env.API_DOMAIN}/uploads/coworking_space/${file.filename}`,
        };
      });

      const deleteOldImages = await prisma.coworkingSpaceImage.deleteMany({
        where: {
          space_id: coworkingSpace.space_id,
        },
      });

      if (!deleteOldImages) {
        return res.status(400).json({ message: "Failed to delete old images" });
      }

      for (oldImage of deleteOldImages) {
        const oldImagePath = oldImage.image_url.split(
          "/uploads/coworking_space/"
        )[1];
        fs.unlinkSync(
          path.join(__dirname, `../uploads/coworking_space/${oldImagePath}`)
        );
      }

      const images = await prisma.coworkingSpaceImage.createMany({
        data: reqImages,
      });

      if (!images) {
        return res.status(400).json({ message: "Failed to edit images" });
      }

      resImages = await prisma.coworkingSpaceImage.findMany({
        where: {
          space_id: coworkingSpace.space_id,
        },
      });
    }

    let resFacilities;

    if (facilities) {
      const reqFacilities = facilities.split(",").map((facility) => {
        return {
          id: facility,
        };
      });

      const deleteOldFacilities =
        await prisma.coworkingSpaceFacility.deleteMany({
          where: {
            space_id: coworkingSpace.space_id,
          },
        });

      if (!deleteOldFacilities) {
        return res
          .status(400)
          .json({ message: "Failed to delete old facilities" });
      }

      for (let i = 0; i < reqFacilities.length; i++) {
        const facility = await prisma.facility.findUnique({
          where: {
            facility_id: parseInt(reqFacilities[i].id),
          },
        });

        if (!facility) {
          return res.status(400).json({ message: "Facility not found" });
        }

        await prisma.coworkingSpaceFacility.create({
          data: {
            space_id: coworkingSpace.space_id,
            facility_id: facility.facility_id,
          },
        });

        resFacilities = await prisma.coworkingSpaceFacility.findMany({
          where: {
            space_id: coworkingSpace.space_id,
          },
          include: {
            facility: true,
          },
        });
      }
    }

    return res.status(200).json({
      message: "Edit coworking space success",
      coworkingSpace: resCoworkingSpace,
      location: resLocation,
      images: resImages,
      facilities: resFacilities,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoworkingSpaces,
  addCoworkingSpace,
  updateCoworkingSpace,
};
