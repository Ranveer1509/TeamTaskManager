const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { addMember } = require("../controllers/teamController");

router.post("/add", auth, role("Admin"), addMember);

module.exports = router;