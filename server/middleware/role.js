module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      if (roles.length === 0) {
        return res.status(500).json({
          success: false,
          message: "No roles configured for this route",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      return next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Role check failed",
      });
    }
  };
};