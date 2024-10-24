const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  updatePhoneNumber
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

const {uploadProfilePicture} = require("../middlewares/uploadMiddleware");

router.post("/register", uploadProfilePicture.single("profilePicture"), registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getUserProfile);

router.put("/profile", authMiddleware, uploadProfilePicture.single("profilePicture"), updateUserProfile);

router.put("/change-password", authMiddleware, changePassword);

router.patch("/profile", authMiddleware, updatePhoneNumber);

router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
