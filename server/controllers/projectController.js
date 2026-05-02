const Project = require("../models/Project");

// CREATE PROJECT (Admin only already handled by middleware)
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // 1. Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    // 2. Create project
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: project,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET PROJECTS
exports.getProjects = async (req, res) => {
  try {
    let projects;

    // Admin → see all
    if (req.user.role === "Admin") {
      projects = await Project.findAll();
    } 
    // Member → see only their projects
    else {
      projects = await Project.findAll({
        where: { createdBy: req.user.id },
      });
    }

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};