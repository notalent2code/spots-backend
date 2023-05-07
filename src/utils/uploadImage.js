const multer = require("multer");
const path = require("path");

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/avatar/"));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const ktpStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/ktp/"));
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/pjpeg"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type."));
    }
};

const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const ktpUpload = multer({
    storage: ktpStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = {
    avatarUpload,
    ktpUpload,
}