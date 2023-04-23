const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auth");

dotenv.config();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// The 404 Route
app.get("*", function (_req, res) {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = app;