const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100], // minimum 6 chars
    },
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "Member",
    validate: {
      isIn: [["Admin", "Member"]],
    },
  },
}, {
  timestamps: true,
});

// Import after model definition (safer)
const Project = require("./Project");
const Task = require("./Task");

// Relationships
User.hasMany(Task, { foreignKey: "assignedTo", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "assignedTo" });

User.hasMany(Project, { foreignKey: "createdBy", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "createdBy" });

module.exports = User;