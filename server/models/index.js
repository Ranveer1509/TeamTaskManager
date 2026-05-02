const sequelize = require("../config/db");

const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Team = require("./Team");

// ================= RELATIONS =================

// USER
User.hasMany(Project, { foreignKey: "createdBy" });
Project.belongsTo(User, { foreignKey: "createdBy" });

// PROJECT - TASK
Project.hasMany(Task, { foreignKey: "projectId", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "projectId" });

// USER - TEAM
User.hasMany(Team, { foreignKey: "userId" });
Team.belongsTo(User, { foreignKey: "userId" });

// PROJECT - TEAM
Project.hasMany(Team, { foreignKey: "projectId" });
Team.belongsTo(Project, { foreignKey: "projectId" });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  Team,
};