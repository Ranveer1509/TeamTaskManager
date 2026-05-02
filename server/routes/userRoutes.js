const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// 🔐 Admin middleware (robust check)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied (Admin only)",
    });
  }

  next();
};

// ================= ROUTES =================

// 👑 Get all users
router.get("/", auth, isAdmin, getAllUsers);

// 👑 Update role
router.put("/:id", auth, isAdmin, updateUserRole);

module.exports = router;