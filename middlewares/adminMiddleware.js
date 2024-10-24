const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId).select("-password");
  console.log(user.role);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied! Admins only" });
  }
  next();
};

module.exports = adminMiddleware;
