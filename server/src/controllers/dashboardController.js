const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
  try {
    const [
      colleges,
      students,
      faculty,
      departments,
      courses,
    ] = await Promise.all([
      prisma.college.count(),
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.department.count(),
      prisma.course.count(),
    ]);

    res.json({
      colleges,
      students,
      faculty,
      departments,
      courses,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};