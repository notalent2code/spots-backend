const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const dotenv = require("dotenv");

const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auth");
const tenantRouter = require("./src/routes/tenant");
const ownerRouter = require("./src/routes/owner");

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
app.use("/api/tenants", tenantRouter);
app.use("/api/owners", ownerRouter);

// The 404 Route
app.get("*", function (_req, res) {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = app;