require("dotenv").config();

const prisma = require("./lib/prisma");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const roleDashboardRoutes = require("./routes/roleDashboardRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard", roleDashboardRoutes);
app.use("/api/assignments", assignmentRoutes);

// Health check
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      message: "EduSphere API is running 🚀",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EduSphere server running on port ${PORT}`);
});