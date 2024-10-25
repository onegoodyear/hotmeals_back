const Restaurant = require("../models/Restaurant");
const Item = require("../models/Item");

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
    const { name, menu, location, cuisineType, averageRating, contact } =
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
      menu,
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

exports.addItemsToRestaurant = async (req, res) => {
  const id = req.params.id;
  const items = req.body.items;
  const images = req.files;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items must be an array and cannot be empty." });
    }
    const savedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { name, price, description } = item;
      if (!name || !price) {
        continue;
      }
      const newItem = new Item({
        name,
        price,
        image: images[i] ? images[i].path : undefined,
        description: description,
        restaurant: restaurant._id,
      });
      const savedItem = await newItem.save();
      savedItems.push(savedItem._id);
    }
    if (!Array.isArray(restaurant.menu)) {
      restaurant.menu = [];
    }
    restaurant.menu.push(...savedItems);
    await restaurant.save();
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
