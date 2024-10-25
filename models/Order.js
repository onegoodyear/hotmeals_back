const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      note: {
        type: String,
        default: "",
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ],
  },
  deliveryAddress: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
  },
  deliveryInstructions: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
