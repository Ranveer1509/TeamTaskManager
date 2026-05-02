const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

router.get("/", auth, role("Admin"), getAllUsers);
router.put("/:id", auth, role("Admin"), updateUserRole);

module.exports = router;