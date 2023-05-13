const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const dotenv = require("dotenv");

const verifyAuth = require("./src/middlewares/auth");
const verifyTenant = require("./src/middlewares/tenant");
const verifyOwner = require("./src/middlewares/owner");
const verifyAdmin = require("./src/middlewares/admin");

const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auth");
const tenantRouter = require("./src/routes/tenant");
const ownerRouter = require("./src/routes/owner");
const adminRouter = require("./src/routes/admin");
const coworkingRouter = require("./src/routes/coworkingSpace");

dotenv.config();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, "./src/uploads")));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.WEB_DOMAIN,
    credentials: true,
  })
);

// Routes
app.use("/api/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/tenants", verifyAuth, verifyTenant, tenantRouter);
app.use("/api/owners", verifyAuth, verifyOwner, ownerRouter);
app.use("/api/admin/", verifyAuth, verifyAdmin, adminRouter);
app.use("/api/coworking-space", coworkingRouter);

// The 404 Route
app.get("*", function (_req, res) {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = app;