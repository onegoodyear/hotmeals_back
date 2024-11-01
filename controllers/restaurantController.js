// controllers/orderController.js
const restaurantServices = require("../services/restaurantServices");

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantServices.getAllRestaurants();
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Error while fetching restaurants:", error);
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await restaurantServices.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ restaurant });
  } catch (error) {
    console.error("Error while fetching restaurant by id:", error);
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const { name, menu, location, cuisineType, averageRating, contact } = req.body;

    if (!name || !location || !cuisineType || !contact) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const logoUrl = req.file ? req.file.path : null;
    const restaurantData = {
      name,
      logo: logoUrl,
      location: {
        address: location.address,
        mapCorrdinates: location.mapCorrdinates || {},
      },
      cuisineType,
      averageRating: averageRating,
      contact: {
        phone: contact.phone,
        email: contact.email,
        socialMedia: contact.socialMedia,
      },
      menu,
    };

    const savedRestaurant = await restaurantServices.createRestaurant(restaurantData);
    res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      message: "Server error. Could not create restaurant.",
      error: error.message,
    });
  }
};

exports.addItemsToRestaurant = async (req, res) => {
  const id = req.params.id;
  const items = req.body.items;
  const images = req.files;
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be an array and cannot be empty." });
    }

    const restaurant = await restaurantServices.addItemsToRestaurant(id, items, images);
    return res.status(201).json({
      message: "Items added to restaurant successfully!",
      restaurant,
    });
  } catch (error) {
    console.error("Error adding items to restaurant:", error);
    res.status(500).json({
      message: "Server error. Could not add items to restaurant.",
      error: error.message,
    });
  }
};
