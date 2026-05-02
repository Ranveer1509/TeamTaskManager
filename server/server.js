const express = require("express");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require("cors");

require("dotenv").config(); // ✅ add this

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ FIXED PORT HANDLING
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});