const Restaurant = require("../models/Restaurant");

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Error while fetching restaurants:", error);
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
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
    // Destructure the request body
    const { name, logo, location, cuisineType, averageRating, contact } =
      req.body;

    // Check if all required fields are present
    if (!name || !location || !cuisineType || !contact) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const logoUrl = req.file ? req.file.path : null;

    // Create a new restaurant object
    const newRestaurant = new Restaurant({
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
    });

    const savedRestaurant = await newRestaurant.save();

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
