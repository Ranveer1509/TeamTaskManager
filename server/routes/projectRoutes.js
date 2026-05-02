const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const projectController = require("../controllers/projectController");

// 🔐 Inline admin check (safer than external role middleware)
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Only Admin can create projects",
    });
  }
  next();
};

// ================= ROUTES =================

// ✅ Create project (Admin only)
router.post("/", auth, isAdmin, projectController.createProject);

// ✅ Get all projects
router.get("/", auth, projectController.getProjects);

module.exports = router;