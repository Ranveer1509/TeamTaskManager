const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and Project ID are required",
      });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const assignee = req.user.role === "Admin" ? assignedTo : req.user.id;

    if (!assignee) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
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

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, title, description, dueDate } = req.body;

    const allowedStatus = ["Todo", "In Progress", "Done"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (req.user.role !== "Admin" && task.assignedTo !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    if (status) task.status = status;

    if (req.user.role === "Admin") {
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

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
