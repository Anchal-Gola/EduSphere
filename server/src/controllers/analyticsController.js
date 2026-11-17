const prisma = require("../lib/prisma");

// 1. Per-college breakdown
const getCollegeAnalytics = async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        _count: {
          select: { departments: true, students: true, faculty: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(
      colleges.map(({ _count, ...c }) => ({
        ...c,
        departments: _count.departments,
        students: _count.students,
        faculty: _count.faculty,
      }))
    );
  } catch (error) {
    console.error("College analytics error:", error);
    res.status(500).json({ message: "Failed to fetch college analytics" });
  }
};

// 2. Per-department breakdown (optional ?collegeId=...)
const getDepartmentAnalytics = async (req, res) => {
  try {
    const { collegeId } = req.query;

    const departments = await prisma.department.findMany({
      where: collegeId ? { collegeId } : {},
      select: {
        id: true,
        name: true,
        code: true,
        college: { select: { id: true, name: true } },
        _count: { select: { students: true, faculty: true, courses: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json(
      departments.map(({ _count, ...d }) => ({
        ...d,
        students: _count.students,
        faculty: _count.faculty,
        courses: _count.courses,
        studentFacultyRatio:
          _count.faculty > 0
            ? Number((_count.students / _count.faculty).toFixed(1))
            : null,
      }))
    );
  } catch (error) {
    console.error("Department analytics error:", error);
    res.status(500).json({ message: "Failed to fetch department analytics" });
  }
};

// 3. Course enrollment and faculty coverage
const getCourseAnalytics = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        credits: true,
        department: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, facultyAssignments: true } },
      },
    });

    const list = courses
      .map(({ _count, ...c }) => ({
        ...c,
        enrolledStudents: _count.enrollments,
        assignedFaculty: _count.facultyAssignments,
      }))
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents);

    res.json({
      topCourses: list.slice(0, 10),
      coursesWithoutFaculty: list.filter((c) => c.assignedFaculty === 0),
      totalCourses: list.length,
    });
  } catch (error) {
    console.error("Course analytics error:", error);
    res.status(500).json({ message: "Failed to fetch course analytics" });
  }
};

// 4. Monthly growth of students and faculty (?months=6)
const getGrowthAnalytics = async (req, res) => {
  try {
    const months = Math.min(Math.max(parseInt(req.query.months) || 6, 1), 24);

    const now = new Date();
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1)
    );

    const [students, faculty] = await Promise.all([
      prisma.student.findMany({
        where: { createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.faculty.findMany({
        where: { createdAt: { gte: start } },
        select: { createdAt: true },
      }),
    ]);

    const keyOf = (d) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

    const buckets = {};
    for (let i = 0; i < months; i++) {
      const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
      buckets[keyOf(d)] = { month: keyOf(d), students: 0, faculty: 0 };
    }

    students.forEach((s) => {
      const k = keyOf(s.createdAt);
      if (buckets[k]) buckets[k].students++;
    });
    faculty.forEach((f) => {
      const k = keyOf(f.createdAt);
      if (buckets[k]) buckets[k].faculty++;
    });

    res.json(Object.values(buckets));
  } catch (error) {
    console.error("Growth analytics error:", error);
    res.status(500).json({ message: "Failed to fetch growth analytics" });
  }
};

// 5. Insights: things that need admin attention
const getInsights = async (req, res) => {
  try {
    const [
      studentsWithoutEnrollment,
      facultyWithoutCourses,
      coursesWithoutFaculty,
      coursesWithoutStudents,
      departmentsWithoutFaculty,
      departmentsWithoutStudents,
    ] = await Promise.all([
      prisma.student.count({ where: { enrollments: { none: {} } } }),
      prisma.faculty.count({ where: { courseAssignments: { none: {} } } }),
      prisma.course.count({ where: { facultyAssignments: { none: {} } } }),
      prisma.course.count({ where: { enrollments: { none: {} } } }),
      prisma.department.count({ where: { faculty: { none: {} } } }),
      prisma.department.count({ where: { students: { none: {} } } }),
    ]);

    res.json({
      studentsWithoutEnrollment,
      facultyWithoutCourses,
      coursesWithoutFaculty,
      coursesWithoutStudents,
      departmentsWithoutFaculty,
      departmentsWithoutStudents,
    });
  } catch (error) {
    console.error("Insights error:", error);
    res.status(500).json({ message: "Failed to fetch insights" });
  }
};

module.exports = {
  getCollegeAnalytics,
  getDepartmentAnalytics,
  getCourseAnalytics,
  getGrowthAnalytics,
  getInsights,
};