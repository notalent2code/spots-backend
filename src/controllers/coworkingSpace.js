const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const getAllPrismaStatement = {
  select: {
    name: true,
    price: true,
    capacity: true,
    status: true,
    location: true,
    // availabilities: true,
    coworking_space_images: {
      select: {
        image_url: true,
      },
      take: 1,
    },
  },
};

const getByIdPrismaStatement = {
  select: {
    name: true,
    description: true,
    price: true,
    capacity: true,
    status: true,
    owner: {
      select: {
        user: {
          select: {
            phone_number: true,
          },
        },
      },
    },
    location: {
      select: {
        location_id: true,
        address: true,
        latitude: true,
        longitude: true,
      },
    },
    // availabilities: true,
    coworking_space_images: {
      select: {
        image_url: true,
      },
    },
    coworking_space_facilities: {
      select: {
        facility: {
          select: {
            facility_id: true,
            name: true,
            description: true,
          },
        },
      },
    },
  },
};

const getCoworkingSpaces = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        req.user = decoded;
      });
    }

    const search = req.query.search;

    const limit = 10;
    let page = req.query.page ? req.query.page : 1; 
    page = (parseInt(page) - 1) * limit;

    let coworkingSpaces;

    if (req.query && search) {
      if (req.user && req.user.userType === "OWNER") {
        const owner = await prisma.owner.findUnique({
          where: {
            user_id: parseInt(req.user.userId),
          },
        });

        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          where: {
            owner_id: owner.owner_id,
            name: {
              contains: search,
            },
          },
          ...getAllPrismaStatement,
        });
      } else if (req.user && req.user.userType === "ADMIN") {
        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          where: {
            name: {
              contains: search,
            },
          },
          ...getAllPrismaStatement,
        });
      } else {
        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          where: {
            status: "APPROVED",
            name: {
              contains: search,
            },
          },
          ...getAllPrismaStatement,
        });
      }
    } else {
      if (req.user && req.user.userType === "OWNER") {
        const owner = await prisma.owner.findUnique({
          where: {
            user_id: parseInt(req.user.userId),
          },
        });

        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          where: {
            owner_id: owner.owner_id,
          },
          ...getAllPrismaStatement,
        });
      } else if (req.user && req.user.userType === "ADMIN") {
        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          ...getAllPrismaStatement,
        });
      } else {
        coworkingSpaces = await prisma.coworkingSpace.findMany({
          skip: page,
          take: limit,
          where: {
            status: "APPROVED",
          },
          ...getAllPrismaStatement,
        });
      }
    }

    if (!coworkingSpaces) {
      return res.status(404).json({ message: "Coworking spaces not found" });
    }

    return res.status(200).json({ coworkingSpaces });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getCoworkingSpaceById = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        req.user = decoded;
      });
    }

    let coworkingSpace;

    if (req.user && req.user.userType === "OWNER") {
      const owner = await prisma.owner.findUnique({
        where: {
          user_id: parseInt(req.user.userId),
        },
      });

      coworkingSpace = await prisma.coworkingSpace.findFirst({
        where: {
          owner_id: owner.owner_id,
          space_id: parseInt(req.params.spaceId),
        },
        ...getByIdPrismaStatement,
      });
    } else if (req.user && req.user.userType === "ADMIN") {
      coworkingSpace = await prisma.coworkingSpace.findUnique({
        where: {
          space_id: parseInt(req.params.spaceId),
        },
        ...getByIdPrismaStatement,
      });
    } else {
      coworkingSpace = await prisma.coworkingSpace.findFirst({
        where: {
          space_id: parseInt(req.params.spaceId),
          status: "APPROVED",
        },
        ...getByIdPrismaStatement,
      });
    }

    if (!coworkingSpace) {
      return res.status(404).json({ message: "Coworking space not found" });
    }

    return res.status(200).json({ coworkingSpace });
  } catch (error) {
    console.log(error);
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

    if (req.files == null || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const existingCoworkingSpace = await prisma.coworkingSpace.findUnique({
      where: {
        name,
      },
    });

    if (existingCoworkingSpace) {
      return res
        .status(400)
        .json({ message: "Coworking space with this name already exists" });
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

    const coworkingSpace = await prisma.coworkingSpace.findFirst({
      where: {
        owner_id: verifiedOwner.owner_id,
        space_id: parseInt(req.params.spaceId),
      },
      include: {
        location: true,
        coworking_space_images: true,
        coworking_space_facilities: {
          select: {
            facility: {
              select: {
                facility_id: true,
                name: true,
                description: true,
              },
            },
          },
        },
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

    if (req.files && req.files.length > 0) {
      const reqImages = req.files.map((file) => {
        return {
          space_id: coworkingSpace.space_id,
          image_url: `${process.env.API_DOMAIN}/uploads/coworking_space/${file.filename}`,
        };
      });

      const deleteOldImages = await prisma.coworkingSpaceImage.findMany({
        where: {
          space_id: coworkingSpace.space_id,
        },
      });

      if (!deleteOldImages) {
        return res.status(400).json({ message: "No images found" });
      }

      await prisma.coworkingSpaceImage.deleteMany({
        where: {
          space_id: coworkingSpace.space_id,
        },
      });

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
    }

    resImages = await prisma.coworkingSpaceImage.findMany({
      where: {
        space_id: coworkingSpace.space_id,
      },
    });

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
      }
    }

    resFacilities = await prisma.coworkingSpaceFacility.findMany({
      where: {
        space_id: coworkingSpace.space_id,
      },
      include: {
        facility: true,
      },
    });

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
  getCoworkingSpaceById,
  addCoworkingSpace,
  updateCoworkingSpace,
};
