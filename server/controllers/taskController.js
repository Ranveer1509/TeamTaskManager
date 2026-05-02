const Task = require("../models/Task");
const Project = require("../models/Project");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    // 1. Validation
    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and Project ID are required",
      });
    }

    // 2. Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 3. Assign logic
    const assignee =
      req.user.role === "Admin" ? assignedTo : req.user.id;

    // 4. Create task
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignee,
      dueDate,
    });

    res.status(201).json({
      success: true,
      data: task,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "Admin") {
      tasks = await Task.findAll();
    } else {
      tasks = await Task.findAll({
        where: { assignedTo: req.user.id },
      });
    }

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE TASK STATUS
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Todo", "In Progress", "Done"];

    // 1. Validate status
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // 2. Find task
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3. Authorization check
    if (
      req.user.role !== "Admin" &&
      task.assignedTo !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // 4. Update
    task.status = status;
    await task.save();

    res.json({
      success: true,
      data: task,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};