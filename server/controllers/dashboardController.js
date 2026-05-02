const Task = require("../models/Task");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
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

    const now = new Date();

    const [total, done, inProgress, todo, overdue] = await Promise.all([
      Task.count({ where }),

      Task.count({
        where: { ...where, status: "Done" },
      }),

      Task.count({
        where: { ...where, status: "In Progress" },
      }),

      Task.count({
        where: { ...where, status: "Todo" },
      }),

      Task.count({
        where: {
          ...where,
          dueDate: {
            [Op.ne]: null,
            [Op.lt]: now,
          },
          status: { [Op.ne]: "Done" },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        done,
        inProgress,
        todo,
        overdue,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to load dashboard",
    });
  }
};