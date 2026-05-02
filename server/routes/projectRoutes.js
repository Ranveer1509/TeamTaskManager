const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const projectController = require("../controllers/projectController");

// Create project (Admin only)
router.post("/", auth, role(["Admin"]), projectController.createProject);

// Get projects (Admin → all, Member → own handled in controller)
router.get("/", auth, projectController.getProjects);

module.exports = router;