const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  if (!req.userRole) {
    return res
      .status(401)
      .json({ message: "Access Denied! Authentication error" });
  }
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access Denied! Admins only" });
  }
  next();
};

module.exports = adminMiddleware;
