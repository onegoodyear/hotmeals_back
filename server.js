const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConfig"); // Import connectDB
const userRoutes = require("./routes/userRoutes"); // Import userRoutes
const restaurantRoutes = require("./routes/restaurantRoutes"); // Import restaurantRoutes
const orderRoutes = require("./routes/orderRoutes"); // Import orderRoutes

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS

// MongoDB connection
connectDB();

// Routes
app.use("/users", userRoutes); // Use userRoutes for all /api/users routes
app.use("/restaurants", restaurantRoutes); // Use restaurantRoutes for all /api/restaurants routes
app.use("/orders", orderRoutes); // Use orderRoutes for all /api/orders routes

// Server listener
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
