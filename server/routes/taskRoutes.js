const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

// Create task
router.post("/", auth, taskController.createTask);

// Get tasks
router.get("/", auth, taskController.getTasks);

// Update task status
router.put("/:id", auth, taskController.updateTaskStatus);

module.exports = router;