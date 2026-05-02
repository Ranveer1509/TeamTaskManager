module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1. Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user data",
        });
      }

      // 2. Convert single role to array
      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      // 3. Check permission
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};