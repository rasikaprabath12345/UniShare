const mongoose = require("mongoose");

const getUserIdFromRequest = (req) => {
  return (
    req.headers["x-user-id"] ||
    req.headers["x-userid"] ||
    req.headers["user-id"] ||
    req.query.userId ||
    req.body?.userId ||
    null
  );
};

const bookmarkAuth = (req, res, next) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: userId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(String(userId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid userId",
    });
  }

  req.userId = String(userId);
  return next();
};

module.exports = bookmarkAuth;
