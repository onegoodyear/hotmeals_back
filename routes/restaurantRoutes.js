const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  addItemsToRestaurant,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  uploadLogo,
  uploadItemImages,
} = require("../middlewares/uploadMiddleware");

router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadLogo.single("logo"),
  createRestaurant
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadItemImages.array("images"),
  addItemsToRestaurant
);

module.exports = router;
