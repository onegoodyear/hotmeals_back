const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Middleware for uploading profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-images", // Folder for profile pictures
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 150, height: 150, crop: "fill" }],
  },
});

// Middleware for uploading restaurant logos
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "restaurant-logos", // New folder for restaurant logos
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 150, height: 150, crop: "fill" }],
  },
});

// Export the upload middlewares
const uploadProfilePicture = multer({ storage: profileStorage });
const uploadLogo = multer({ storage: logoStorage });

module.exports = { uploadProfilePicture, uploadLogo };
