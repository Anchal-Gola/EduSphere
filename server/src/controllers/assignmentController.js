const prisma = require("../lib/prisma");

// ADMIN: GET FACULTY COURSE ASSIGNMENTS
const getFacultyAssignments = async (req, res) => {
  try {
    const assignments = await prisma.facultyCourse.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
          },
        },
        course: {
          include: {
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(assignments);
  } catch (error) {
    console.error("Get faculty assignments error:", error);
    res.status(500).json({
      message: "Failed to fetch faculty assignments",
    });
  }
};

// ADMIN: ASSIGN COURSE TO FACULTY
const assignCourse = async (req, res) => {
  try {
    const { facultyId, courseId } = req.body;

    if (!facultyId || !courseId) {
      return res.status(400).json({
        message: "Faculty and course are required",
      });
    }

    const [faculty, course] = await Promise.all([
      prisma.faculty.findUnique({ where: { id: facultyId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (faculty.departmentId !== course.departmentId) {
      return res.status(400).json({
        message: "Faculty can only be assigned courses from their own department",
      });
    }

    const assignment = await prisma.facultyCourse.create({
      data: { facultyId, courseId },
      include: {
        faculty: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
        course: { include: { department: true } },
      },
    });

    res.status(201).json({
      message: "Course assigned successfully",
      assignment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "This course is already assigned to this faculty member",
      });
    }

    console.error("Assign course error:", error);
    res.status(500).json({
      message: "Failed to assign course",
    });
  }
};

// ADMIN: REMOVE FACULTY ASSIGNMENT
const removeFacultyAssignment = async (req, res) => {
  try {
    await prisma.facultyCourse.delete({
      where: { id: req.params.id },
    });

    res.json({
      message: "Faculty assignment removed successfully",
    });
  } catch (error) {
    console.error("Remove faculty assignment error:", error);
    res.status(400).json({
      message: "Failed to remove assignment",
    });
  }
};

// ADMIN: GET STUDENT ENROLLMENTS
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.studentCourse.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
          },
        },
        course: { include: { department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};

// ADMIN: ENROLL STUDENT IN COURSE
const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        message: "Student and course are required",
      });
    }

    const [student, course] = await Promise.all([
      prisma.student.findUnique({ where: { id: studentId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ]);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (student.departmentId !== course.departmentId) {
      return res.status(400).json({
        message: "Student can only be enrolled in courses from their own department",
      });
    }

    const enrollment = await prisma.studentCourse.create({
      data: { studentId, courseId },
      include: {
        student: {
          select: { id: true, name: true, email: true, rollNumber: true },
        },
        course: { include: { department: true } },
      },
    });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "This student is already enrolled in this course",
      });
    }

    console.error("Enroll student error:", error);
    res.status(500).json({
      message: "Failed to enroll student",
    });
  }
};

// ADMIN: REMOVE STUDENT ENROLLMENT
const removeEnrollment = async (req, res) => {
  try {
    await prisma.studentCourse.delete({
      where: { id: req.params.id },
    });

    res.json({
      message: "Student enrollment removed successfully",
    });
  } catch (error) {
    console.error("Remove enrollment error:", error);
    res.status(400).json({
      message: "Failed to remove enrollment",
    });
  }
};

// FACULTY: GET MY ASSIGNED COURSES
const getMyFacultyCourses = async (req, res) => {
  try {
    const assignments = await prisma.facultyCourse.findMany({
      where: { facultyId: req.user.id },
      include: {
        course: { include: { department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(assignments);
  } catch (error) {
    console.error("Get my faculty courses error:", error);
    res.status(500).json({
      message: "Failed to fetch faculty courses",
    });
  }
};

// STUDENT: GET MY ENROLLMENTS
const getMyStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.studentCourse.findMany({
      where: { studentId: req.user.id },
      include: {
        course: { include: { department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(enrollments);
  } catch (error) {
    console.error("Get my student enrollments error:", error);
    res.status(500).json({
      message: "Failed to fetch my enrollments",
    });
  }
};

// FACULTY: GET STUDENTS ENROLLED IN MY ASSIGNED COURSES
const getMyFacultyStudents = async (req, res) => {
  try {
    const assignments = await prisma.facultyCourse.findMany({
      where: { facultyId: req.user.id },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    const studentsMap = new Map();

    assignments.forEach((assignment) => {
      assignment.course.enrollments.forEach((enrollment) => {
        if (enrollment.student) {
          const { password, ...safeStudent } = enrollment.student;
          studentsMap.set(safeStudent.id, safeStudent);
        }
      });
    });

    res.json(Array.from(studentsMap.values()));
  } catch (error) {
    console.error("Faculty students error:", error);
    res.status(500).json({
      message: "Failed to fetch faculty students",
    });
  }
};

module.exports = {
  getFacultyAssignments,
  assignCourse,
  removeFacultyAssignment,
  getEnrollments,
  enrollStudent,
  removeEnrollment,
  getMyFacultyCourses,
  getMyStudentEnrollments,
  getMyFacultyStudents,
};