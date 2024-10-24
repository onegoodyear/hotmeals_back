const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  logo: {
    type: String,
    default: null,
  },
  location: {
    address: { type: String, required: true },
    mapCoordinates: {
      latitute: { type: Number, required: null },
      longitude: { type: Number, required: null },
    },
  },
  menu: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    default: [],
  },
  cuisineType: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  contact: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    socialMedia: {
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      tiktok: { type: String, default: null },
    },
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
