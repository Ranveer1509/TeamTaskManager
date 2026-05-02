const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 150],
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
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
  timestamps: true,
});

module.exports = Task;