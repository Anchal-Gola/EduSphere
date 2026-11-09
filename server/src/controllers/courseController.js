const prisma = require("../lib/prisma");

// CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const { name, code, credits, departmentId } = req.body;

    if (!name || !code || !departmentId) {
      return res.status(400).json({
        message: "Name, code and department are required",
      });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        credits: Number(credits) || 3,
        departmentId,
      },
      include: {
        department: {
          include: { college: true },
        },
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
  console.error("Create course error:", error);

  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Course code already exists. Please use a unique code.",
    });
  }

  res.status(500).json({
    message: "Failed to create course",
  });
}
};

// GET COURSES
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: {
          include: { college: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const { name, code, credits, departmentId } = req.body;

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        name,
        code,
        credits: Number(credits) || 3,
        departmentId,
      },
      include: {
        department: {
          include: { college: true },
        },
      },
    });

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(400).json({ message: "Failed to delete course" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};