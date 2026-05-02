require("dotenv").config(); // ✅ MUST be at top

const express = require("express");

// ✅ IMPORTANT: load models + associations
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const teamRoutes = require("./routes/teamRoutes");
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
app.use("/api/users", userRoutes); // ✅ admin routes

// ================= PORT =================
const PORT = process.env.PORT || 5000;

// ================= START SERVER =================
sequelize.sync({ alter: true }) // 🔥 important for fixing schema mismatch
  .then(() => {
    console.log("Database connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("DB ERROR ❌", err);
  });