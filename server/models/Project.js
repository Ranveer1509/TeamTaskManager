const Project = require("../models/Project");

// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    let { name, description } = req.body;

    // 🔍 Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    // 🔐 Check auth user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    // 🚀 Create project
    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: project,
    });

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create project",
    });
  }
};

// ================= GET PROJECTS =================
exports.getProjects = async (req, res) => {
  try {
    // 🔥 Optional: show only user's projects
    const projects = await Project.findAll({
      // where: { createdBy: req.user.id }  // enable if needed
    });

    return res.json({
      success: true,
      data: projects,
    });

  } catch (err) {
    console.error("GET PROJECT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch projects",
    });
  }
};