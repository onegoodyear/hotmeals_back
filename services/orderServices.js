// services/orderService.js
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Item = require("../models/Item");

const orderService = {
  async createOrder(userId, restaurantId, items, deliveryAddress, deliveryInstructions) {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    if (!items || items.length === 0) {
      throw new Error("Items must be provided");
    }

    let totalAmount = 0;
    let deliveryFee = 200; // Fixed delivery fee
    const orderItems = [];

    for (const orderItem of items) {
      const { itemId, quantity, note } = orderItem;
      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error(`Item with ID:${itemId} not found`);
      }

      totalAmount += item.price * quantity;

      orderItems.push({
        item: itemId,
        quantity,
        note,
      });
    }

    const newOrder = new Order({
      user: userId,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      status: "pending",
      deliveryAddress,
      deliveryInstructions,
    });

    return await newOrder.save();
  },

  async getOrders(userRole, userId) {
    const query = userRole === "admin" ? {} : { user: userId };
    return await Order.find(query)
      .populate("restaurant", "name logo")
      .populate("items.item", "name price image")
      .populate("user", "name email phoneNumber")
      .sort({ createdAt: -1 });
  },

  async getOrderById(orderId) {
    return await Order.findById(orderId)
      .populate("restaurant", "name logo")
      .populate("items.item", "name price image")
      .populate("user", "name email phoneNumber");
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    return await order.save();
  },

  async getOrderStatus(orderId) {
    return await Order.findById(orderId, "status updatedAt");
  },

  async cancelOrder(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error("Order cannot be canceled as it is not in pending status");
    }

    order.status = "canceled";
    return await order.save();
  },
};

module.exports = orderService;
