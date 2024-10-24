const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,

} = require("../controllers/userController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getUserProfile);

router.put("/profile", authMiddleware, updateUserProfile);

router.put("/change-password", authMiddleware, changePassword);

router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
