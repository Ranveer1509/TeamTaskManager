const Team = require("../models/Team");

exports.addMember = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    const member = await Team.create({
      userId,
      projectId,
      role: "Member",
    });

    res.json({
      success: true,
      data: member,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};