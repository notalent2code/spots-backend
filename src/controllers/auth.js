const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config({path: __dirname + '/.env'});
const prisma = new PrismaClient();

// Register user
const register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Invalid body" });
    }

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      userType,
    } = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    const userData = {
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      user_type: userType,
    };

    if (userType === "TENANT") {
      const defaultAvatarURL = `${process.env.API_DOMAIN}/uploads/avatar/default-avatar.png`;
      
      user = await prisma.user.create({
        data: {
          ...userData,
          tenant: {
            create: {
              avatar_url: defaultAvatarURL,
            },
          },
        },
        include: {
          tenant: true,
        },
      });
    } else if (userType === "OWNER") {
      user = await prisma.user.create({
        data: {
          ...userData,
          owner: {
            create: {},
          },
        },
        include: {
          owner: true,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Testing purposes only
    // else if (userType === "ADMIN") {
    //   user = await prisma.user.create({
    //     data: {
    //       ...userData,
    //     },
    //   });
    // }

    if (user) {
      delete user.password_hash;
      res.status(201).json({ message: "User created successfully", user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Invalid body" });
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const userId = user.user_id;
    const userType = user.user_type;

    const accessToken = jwt.sign(
      {
        userId,
        userType,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId,
        userType,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // secure: true, // Uncomment this line if you are using HTTPS
    });

    res.status(200).json({ message: "Login success", accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout user
const logout = async (req, res) => {
  try {    
    delete req.headers["authorization"];
  
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(204).json({ message: "No token provided" });

    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    const token = user.refresh_token;

    if (!token) return res.status(204).json({ message: "No token provided" });

    const userId = user.user_id;

    await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        refresh_token: null,
      },
    });

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).send("Access denied");

    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });

    const token = user.refresh_token;

    if (!token) return res.status(403).send("Invalid token");

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send("Invalid token");
      const accessToken = jwt.sign(
        {
          userId: decoded.userId,
          userType: decoded.userType,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
