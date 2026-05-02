const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { addMember, getMembers } = require("../controllers/teamController");

router.get("/", auth, role("Admin"), getMembers);
router.post("/add", auth, role("Admin"), addMember);

module.exports = router;
