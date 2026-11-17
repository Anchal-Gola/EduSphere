const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// CREATE FACULTY
const createFaculty = async (req, res) => {
  try {
    const { name, email, employeeId, password, collegeId, departmentId } = req.body;

    if (!name || !email || !employeeId || !password || !collegeId || !departmentId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        employeeId,
        password: hashedPassword,
        collegeId,
        departmentId,
      },
      include: {
        college: true,
        department: true,
      },
    });

    const { password: _, ...safeFaculty } = faculty;

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: safeFaculty,
    });
  } catch (error) {
    console.error("Create faculty error:", error);
    res.status(500).json({
      message: "Failed to create faculty. Email or employee ID may already exist.",
    });
  }
};

// GET FACULTY
const getFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      include: {
        college: true,
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const safeFaculty = faculty.map(({ password, ...item }) => item);

    res.json(safeFaculty);
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
};

// UPDATE FACULTY
const updateFaculty = async (req, res) => {
  try {
    const { name, email, employeeId, collegeId, departmentId, password } = req.body;

    const data = { name, email, employeeId, collegeId, departmentId };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const faculty = await prisma.faculty.update({
      where: { id: req.params.id },
      data,
      include: {
        college: true,
        department: true,
      },
    });

    const { password: _, ...safeFaculty } = faculty;

    res.json({
      message: "Faculty updated successfully",
      faculty: safeFaculty,
    });
  } catch (error) {
    console.error("Update faculty error:", error);
    res.status(500).json({ message: "Failed to update faculty" });
  }
};

// DELETE FACULTY
const deleteFaculty = async (req, res) => {
  try {
    await prisma.faculty.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Delete faculty error:", error);
    res.status(400).json({ message: "Failed to delete faculty" });
  }
};
// GET MY PROFILE
const getMyFacultyProfile = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: req.user.id },
      include: { college: true, department: true },
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const { password, ...profile } = faculty;
    res.json(profile);
  } catch (error) {
    console.error("Get faculty profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE MY PROFILE
const updateMyFacultyProfile = async (req, res) => {
  try {
    const {
      phone,
      profilePhoto,
      dateOfBirth,
      gender,
      address,
      designation,
      qualification,
    } = req.body;

    const faculty = await prisma.faculty.update({
      where: { id: req.user.id },
      data: {
        phone,
        profilePhoto,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        designation,
        qualification,
      },
    });

    const { password, ...profile } = faculty;

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update faculty profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  getMyFacultyProfile,
  updateMyFacultyProfile,
};