// services/restaurantService.js
const Restaurant = require("../models/Restaurant");
const Item = require("../models/Item");

const restaurantService = {
  getAllRestaurants: async () => {
    return await Restaurant.find();
  },

  getRestaurantById: async (id) => {
    return await Restaurant.findById(id);
  },

  createRestaurant: async (data) => {
    const newRestaurant = new Restaurant(data);
    return await newRestaurant.save();
  },

  addItemsToRestaurant: async (restaurantId, items, images) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const savedItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { name, price, description } = item;
      if (!name || !price) {
        continue; // Skip invalid items
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
    return restaurant;
  },
};

module.exports = restaurantService;
