const Team = require("../models/Team");
const User = require("../models/User");
const Project = require("../models/Project");

exports.addMember = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    // 🔍 Validation
    if (!userId || !projectId) {
      return res.status(400).json({
        success: false,
        message: "userId and projectId are required",
      });
    }

    // ✅ Check user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 🚫 Prevent duplicate entry
    const existing = await Team.findOne({
      where: { userId, projectId },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already assigned to this project",
      });
    }

    // ✅ Create member
    const member = await Team.create({
      userId,
      projectId,
      role: "Member",
    });

    res.json({
      success: true,
      message: "Member added successfully",
      data: member,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};