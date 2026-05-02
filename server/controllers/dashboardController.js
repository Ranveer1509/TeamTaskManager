const Task = require("../models/Task");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {
    const where =
      req.user.role === "Admin"
        ? {}
        : { assignedTo: req.user.id };

    const now = new Date();

    // Run queries in parallel (faster 🚀)
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
          dueDate: { [Op.lt]: now },
          status: { [Op.ne]: "Done" },
        },
      }),
    ]);

    res.json({
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
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};