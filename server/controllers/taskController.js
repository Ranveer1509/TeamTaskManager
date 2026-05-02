const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    let { title, description, projectId, assignedTo, dueDate } = req.body;

    title = title?.trim();
    description = description?.trim() || "";

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and Project ID are required",
      });
    }

    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
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
      title,
      description,
      projectId,
      assignedTo: assignee,
      dueDate: dueDate || null,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create task",
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const where =
      req.user.role === "Admin"
        ? {}
        : { assignedTo: req.user.id };

    const tasks = await Task.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch tasks",
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, assignedTo, title, description, dueDate } = req.body;

    const allowedStatus = ["Todo", "In Progress", "Done"];

    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

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
      if (description !== undefined) task.description = description?.trim() || "";
      if (dueDate !== undefined) task.dueDate = dueDate || null;
    }

    await task.save();

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update task",
    });
  }
};