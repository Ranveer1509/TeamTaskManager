const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    let { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    name = name.trim();

    const existing = await Project.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Project already exists",
      });
    }

    const project = await Project.create({
      name,
      description: description || "",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
