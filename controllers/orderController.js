const orderServices = require("../services/orderServices");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { restaurantId, items, deliveryAddress, deliveryInstructions } = req.body;

    const newOrder = await orderServices.createOrder(userId, restaurantId, items, deliveryAddress, deliveryInstructions);
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
    const orders = await orderServices.getOrders(req.userRole, req.user._id);
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
    const order = await orderServices.getOrderById(orderId);

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

    const updatedOrder = await orderServices.updateOrderStatus(orderId, status);
    return res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
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
    const orderId = req.params.id;
    const order = await orderServices.getOrderStatus(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: order.status, updatedAt: order.updatedAt });
  } catch (error) {
    console.error("Error retrieving order status:", error);
    res.status(500).json({ message: "Server error. Could not retrieve order status." });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.id;

    const canceledOrder = await orderServices.cancelOrder(userId, orderId);
    return res.status(200).json({
      message: "Order canceled successfully",
      order: canceledOrder,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res.status(500).json({
      message: "Server error. Could not cancel order.",
      error: error.message,
    });
  }
};
