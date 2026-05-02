const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
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
      len: [6, 255],
    },
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
  hooks: {
    beforeValidate(user) {
      if (user.name) user.name = user.name.trim();
      if (user.email) user.email = user.email.trim().toLowerCase();
    },
  },
});

module.exports = User;