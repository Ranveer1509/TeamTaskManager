const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const projectController = require("../controllers/projectController");

router.post("/", auth, role("Admin"), projectController.createProject);
router.get("/", auth, projectController.getProjects);

module.exports = router;