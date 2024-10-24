const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 150, height: 150, crop: "fill" }],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
