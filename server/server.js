require("dotenv").config(); // ✅ MUST be at top

const express = require("express");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const teamRoutes = require("./routes/teamRoutes");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ Health check route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/team", teamRoutes);

// ✅ PORT (Railway compatible)
const PORT = process.env.PORT || 5000;

// Start server
sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});