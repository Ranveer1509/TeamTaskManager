const sequelize = require("../config/db");

const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Team = require("./Team");

// ================= USER - PROJECT =================
User.hasMany(Project, {
  foreignKey: "createdBy",
  onDelete: "CASCADE",
});

Project.belongsTo(User, {
  foreignKey: "createdBy",
});

// ================= PROJECT - TASK =================
Project.hasMany(Task, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
});

Task.belongsTo(Project, {
  foreignKey: "projectId",
});

// ================= USER - TASK =================
User.hasMany(Task, {
  foreignKey: "assignedTo",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "assignedTo",
});

// ================= USER - TEAM =================
User.hasMany(Team, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Team.belongsTo(User, {
  foreignKey: "userId",
});

// ================= PROJECT - TEAM =================
Project.hasMany(Team, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
});

Team.belongsTo(Project, {
  foreignKey: "projectId",
});

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  Team,
};