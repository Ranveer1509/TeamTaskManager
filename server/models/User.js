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

module.exports = User;