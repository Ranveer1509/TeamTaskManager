const Project = require("../models/Project");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    let { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      createdBy: req.user.id, // ✅ FIX HERE
    });

    return res.status(201).json({
      success: true,
      data: project,
    });

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();

    return res.json({
      success: true,
      data: projects,
    });

  } catch (err) {
    console.error("GET PROJECT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};