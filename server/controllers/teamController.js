const Team = require("../models/Team");
const User = require("../models/User");
const Project = require("../models/Project");

exports.addMember = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!userId || !projectId) {
      return res.status(400).json({
        success: false,
        message: "userId and projectId are required",
      });
    }

    if (Number.isNaN(Number(userId)) || Number.isNaN(Number(projectId))) {
      return res.status(400).json({
        success: false,
        message: "userId and projectId must be valid numbers",
      });
    }

    const user = await User.findByPk(Number(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const project = await Project.findByPk(Number(projectId));
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const existing = await Team.findOne({
      where: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already assigned to this project",
      });
    }

    const member = await Team.create({
      userId: Number(userId),
      projectId: Number(projectId),
      role: "Member",
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add member",
    });
  }
};