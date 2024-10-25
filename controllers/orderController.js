const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const Item = require("../models/Item");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { restaurantId, items, deliveryAddress, deliveryInstructions } =
      req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if items are provided
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items must be provided" });
    }

    let totalAmount = 0;
    let deliveryFee = 200; // for now, delivery fee is fixed at 200
    const orderItems = [];

    for (const orderItem of items) {
      const { itemId, quantity, note } = orderItem;
      const item = await Item.findById(itemId);
      if (!item) {
        return res
          .status(404)
          .json({ message: `Item with ID:${itemId} not found` });
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

    await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Server error. Could not create order",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    // Determine the query based on userRole
    const query = req.user.role === "admin" ? {} : { user: req.user._id };

    const orders = await Order.find(query)
      .populate("restaurant", "name logo")
      .populate("items.item", "name price image")
      .populate("user", "name email phoneNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Server error. Could not retrieve orders.",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("restaurant", "name logo")
      .populate("items.item", "name price image")
      .populate("user", "name email phoneNumber");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error retrieving order:", error);
    return res.status(500).json({
      message: "Server error. Could not retrieve order.",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res.status(403).json({ message: "Access Denied! Admins only" });
    }
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      message: "Server error. Could not update order status.",
      error: error.message,
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(orderId, "status updatedAt");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: order.status, updatedAt: order.updatedAt });
  } catch (error) {
    console.error("Error retrieving order status:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not retrieve order status." });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be canceled as it is not in pending status",
      });
    }

    order.status = "canceled";
    await order.save();

    return res.status(200).json({
      message: "Order canceled successfully",
      order,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res.status(500).json({
      message: "Server error. Could not cancel order.",
      error: error.message,
    });
  }
};
