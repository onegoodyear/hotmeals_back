const User = require("../models/User");
const jwt = require("jsonwebtoken");

// User Registration
exports.registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, address, role } = req.body;
  try {
    if (role == "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to be assigned admin" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    const profilePictureUrl = req.file ? req.file.path : null;
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      address,
      profilePictureUrl,
      role: role || "user",
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ userId: user._id, token });
  } catch (error) {
    console.error("Error during registration:", error); // Log the full error
    res.status(500).json({
      message: "Something went wrong with the server",
      error: error.message || "Unknown error occurred", // Send a readable error message
    });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, phoneNumber, address, profilePictureUrl } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, phoneNumber, address, profilePictureUrl },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    user.password = newPassword; // Hashing will be done in the pre-save hook
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

// Delete Userz
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server" });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const userId = req.user.id; // Assuming you're using a middleware to set req.user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber },
      { new: true }
    ).select("-password");
    res.status(200).json({
      message: "Phone number updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating phone number:", error);
    res.status(500).json({
      message: "Something went wrong with the server",
      error: error.message,
    });
  }
};
