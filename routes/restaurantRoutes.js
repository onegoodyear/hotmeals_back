const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
} = require("../controllers/restaurantController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { uploadLogo } = require("../middlewares/uploadMiddleware");

router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadLogo.single("logo"),
  createRestaurant
);

module.exports = router;
