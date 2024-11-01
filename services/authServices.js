const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (userData) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    address,
    role,
    profilePictureUrl,
  } = userData;

  if (role === "admin") {
    throw new Error("You are not authorized to be assigned admin");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already in use");
  }

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
    { expiresIn: "1h" }
  );

  return { userId: user._id, token };
};

exports.loginUser = async (identifier, password) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { phoneNumber: identifier }],
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Wrong Password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { userId: user._id, token };
};

exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

exports.updateUserProfile = async (userId, userData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error("Wrong Password");
  }

  user.password = newPassword;
  await user.save();

  return "Password changed successfully";
};

exports.deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return "User deleted successfully";
};

exports.updatePhoneNumber = async (userId, phoneNumber) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { phoneNumber },
    { new: true }
  ).select("-password");
  return updatedUser;
};

exports.handleGoogleAuth = async (user) => {
  let user = await User.findOne({ googleId: googleProfile.id });
  const email = googleProfile.emails && googleProfile.emails[0] ? googleProfile.emails[0].value : null;
  if (!email) {
    throw new Error("Google profile does not contain an email.");
  }
  if (user) {
    return user;
  }
  user = new User({
    name: googleProfile.displayName,
    email: googleProfile.emails[0].value,
    googleId: googleProfile.id,
  });
  console.log("New User: ", user);
  await user.save();
  return user;
};
