const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

// 🔐 Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied (Admin only)",
    });
  }
  next();
};

// ================= ROUTES =================

// 👑 Get all users (Admin only)
router.get("/", auth, isAdmin, getAllUsers);

// 👑 Update user role (Admin only)
router.put("/:id", auth, isAdmin, updateUserRole);

module.exports = router;