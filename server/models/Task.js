const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Todo",
    validate: {
      isIn: [["Todo", "In Progress", "Done"]],
    },
  },

  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // adds createdAt, updatedAt
});

module.exports = Task;