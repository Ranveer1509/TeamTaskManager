const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
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
      len: [6, 100],
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

// Imports
const Project = require("./Project");
const Task = require("./Task");
const Team = require("./Team");

// 1. Task assignment
User.hasMany(Task, { foreignKey: "assignedTo", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "assignedTo" });

// 2. Project creator
User.hasMany(Project, { foreignKey: "createdBy", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "createdBy" });

// 3. Team (Many-to-Many)
User.belongsToMany(Project, { through: Team, foreignKey: "userId" });
Project.belongsToMany(User, { through: Team, foreignKey: "projectId" });

module.exports = User;