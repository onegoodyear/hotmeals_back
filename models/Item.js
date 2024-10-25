const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
