const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Team = sequelize.define("Team", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Member",
    validate: {
      isIn: [["Admin", "Member"]],
    },
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["userId", "projectId"],
    },
  ],
});

module.exports = Team;