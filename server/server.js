require("dotenv").config(); // ✅ MUST be at top

const express = require("express");
const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const teamRoutes = require("./routes/teamRoutes");


// ✅ NEW: User routes for Admin panel
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/team", teamRoutes);

// ✅ NEW: Admin panel APIs
app.use("/api/users", userRoutes);

// ================= PORT =================
const PORT = process.env.PORT || 5000;

// ================= START SERVER =================
sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});