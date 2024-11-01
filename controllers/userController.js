// controllers/UserController.js
const userServices = require("../services/userServices");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, role } = req.body;
    const profilePictureUrl = req.file ? req.file.path : null;
    const result = await userServices.registerUser({ name, email, password, phoneNumber, address, role, profilePictureUrl });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.message === "Email is already in use" ? 400 : 500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await userServices.loginUser(identifier, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userServices.getUserProfile(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userServices.updateUserProfile(req.userId, req.body);
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const message = await userServices.changePassword(req.userId, oldPassword, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    res.status(error.message === "Wrong Password" ? 400 : 500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const message = await userServices.deleteUser(req.userId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const updatedUser = await userServices.updatePhoneNumber(req.userId, phoneNumber);
    res.status(200).json({
      message: "Phone number updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong with the server",
      error: error.message,
    });
  }
};
