
const prisma = require("../lib/prisma");

// FACULTY DASHBOARD STATS
const getFacultyStats = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        department: true,
        college: true,
      },
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const [courses, assignments] = await Promise.all([
      prisma.facultyCourse.count({
        where: { facultyId },
      }),
      prisma.facultyCourse.findMany({
        where: { facultyId },
        select: {
          courseId: true,
        },
      }),
    ]);

    const courseIds = assignments.map((item) => item.courseId);

    const students = courseIds.length
      ? await prisma.studentCourse.findMany({
          where: {
            courseId: { in: courseIds },
          },
          select: {
            studentId: true,
          },
          distinct: ["studentId"],
        })
      : [];

    res.json({
      faculty,
      courses,
      students: students.length,
      department: faculty.department,
    });
  } catch (error) {
    console.error("Faculty dashboard error:", error);
    res.status(500).json({
      message: "Failed to fetch faculty stats",
    });
  }
};

// STUDENT DASHBOARD
const getStudentStats = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      include: {
        college: true,
        department: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student,
      college: student.college,
      department: student.department,
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({
      message: "Failed to fetch student stats",
    });
  }
};

module.exports = {
  getFacultyStats,
  getStudentStats,
};
