const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// CREATE STUDENT
const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, password, collegeId, departmentId } = req.body;

    if (!name || !email || !rollNumber || !password || !collegeId || !departmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        name,
        email,
        rollNumber,
        password: hashedPassword,
        collegeId,
        departmentId,
      },
      include: { college: true, department: true },
    });

    const { password: _, ...safeStudent } = student;

    res.status(201).json({
      message: "Student created successfully",
      student: safeStudent,
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({
      message: "Failed to create student. Email or roll number may already exist.",
    });
  }
};

// GET STUDENTS
const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { college: true, department: true },
      orderBy: { createdAt: "desc" },
    });

    const safeStudents = students.map(({ password, ...student }) => student);
    res.json(safeStudents);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, password, collegeId, departmentId } = req.body;

    const data = { name, email, rollNumber, collegeId, departmentId };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const student = await prisma.student.update({
      where: { id: req.params.id },
      data,
      include: { college: true, department: true },
    });

    const { password: _, ...safeStudent } = student;

    res.json({
      message: "Student updated successfully",
      student: safeStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(400).json({ message: "Failed to delete student" });
  }
};
// GET MY PROFILE
const getMyStudentProfile = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      include: { college: true, department: true },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { password, ...profile } = student;
    res.json(profile);
  } catch (error) {
    console.error("Get student profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE MY PROFILE
const updateMyStudentProfile = async (req, res) => {
  try {
    const { phone, profilePhoto, dateOfBirth, gender, address } = req.body;

    const student = await prisma.student.update({
      where: { id: req.user.id },
      data: {
        phone,
        profilePhoto,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
      },
    });

    const { password, ...profile } = student;
    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update student profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getMyStudentProfile,
  updateMyStudentProfile,
};