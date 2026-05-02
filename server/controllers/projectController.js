const Project = require("../models/Project");

// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    let { name } = req.body;

    // 🔍 Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    name = name.trim();

    // 🔁 Optional: prevent duplicate project names
    const existing = await Project.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Project already exists",
      });
    }

    // ✅ Create project
    const project = await Project.create({ name });

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

// ================= GET ALL PROJECTS =================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["createdAt", "DESC"]], // 🔥 newest first
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