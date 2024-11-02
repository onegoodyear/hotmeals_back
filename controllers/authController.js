// controllers/authController.js
const authServices = require("../services/authServices");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const userData = { ...req.body, profilePictureUrl: req.file ? req.file.path : null };
    const result = await authServices.registerUser(userData);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.message === "Email is already in use" ? 400 : 500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await authServices.loginUser(req.body.identifier, req.body.password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await authServices.getUserProfile(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await authServices.updateUserProfile(req.userId, req.body);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const message = await authServices.changePassword(req.userId, req.body.oldPassword, req.body.newPassword);
    res.status(200).json({ message });
  } catch (error) {
    res.status(error.message === "Wrong Password" ? 400 : 500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const message = await authServices.deleteUser(req.userId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  try {
    const updatedUser = await authServices.updatePhoneNumber(req.userId, req.body.phoneNumber);
    res.status(200).json({ message: "Phone number updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong with the server", error: error.message });
  }
};

// Google Auth
exports.googleAuth = authServices.googleAuth;

exports.googleAuthCallback = async (req, res) => {
  try {
    const result = await authServices.googleAuthCallback(req.user);
    res.redirect(`/orders?token=${result.token}`);
  } catch (error) {
    console.error("Google Auth Callback Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
