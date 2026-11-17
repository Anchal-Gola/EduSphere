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

    const { password, ...safeFaculty } = faculty;

    // Courses assigned to this faculty, with enrolled student count
    const assignments = await prisma.facultyCourse.findMany({
      where: { facultyId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            credits: true,
            _count: { select: { enrollments: true } },
          },
        },
      },
    });

    const courseList = assignments.map((item) => ({
      id: item.course.id,
      name: item.course.name,
      code: item.course.code,
      credits: item.course.credits,
      enrolledStudents: item.course._count.enrollments,
    }));

    const courseIds = courseList.map((course) => course.id);

    // Unique students across all assigned courses
    const students = courseIds.length
      ? await prisma.studentCourse.findMany({
          where: { courseId: { in: courseIds } },
          select: { studentId: true },
          distinct: ["studentId"],
        })
      : [];

    res.json({
      faculty: safeFaculty,
      courses: courseList.length,
      students: students.length,
      totalCredits: courseList.reduce((sum, c) => sum + (c.credits || 0), 0),
      courseList,
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

    const { password, ...safeStudent } = student;

    // Courses this student is enrolled in
    const enrollments = await prisma.studentCourse.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          select: { id: true, name: true, code: true, credits: true },
        },
      },
    });

    const enrolledCourses = enrollments.map((item) => item.course);

    res.json({
      student: safeStudent,
      college: student.college,
      department: student.department,
      enrolledCount: enrolledCourses.length,
      totalCredits: enrolledCourses.reduce(
        (sum, c) => sum + (c.credits || 0),
        0
      ),
      enrolledCourses,
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