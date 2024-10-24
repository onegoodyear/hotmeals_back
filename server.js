const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConfig"); // Import connectDB
const userRoutes = require("./routes/userRoutes"); // Import userRoutes


dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors());         // Enable CORS

// MongoDB connection
connectDB();

// Routes
app.use("/users", userRoutes); // Use userRoutes for all /api/users routes

// Server listener
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



