const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check token exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 2. Extract token (Bearer TOKEN)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // 3. Verify token using ENV
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    // Handle token errors clearly
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};