const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ================= STUDENT REGISTER =================
const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      collegeId,
      departmentId,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !rollNumber ||
      !collegeId ||
      !departmentId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rollNumber,
        collegeId,
        departmentId,
      },
    });

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Student registration failed" });
  }
};

// ================= STUDENT LOGIN =================
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(student.id, "STUDENT");

    const { password: _, ...studentData } = student;

    res.json({
      message: "Student login successful",
      token,
      user: studentData,
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN REGISTER =================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminCount = await prisma.admin.count();

    if (adminCount > 0) {
      return res.status(403).json({
        message: "Admin registration is closed. Contact an existing administrator.",
      });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

// ================= ADMIN LOGIN =================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin.id, "ADMIN");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

// ================= FACULTY LOGIN =================
const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await prisma.faculty.findUnique({
      where: { email },
    });

    if (
      !faculty ||
      !(await bcrypt.compare(password, faculty.password))
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(faculty.id, "FACULTY");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        role: "FACULTY",
      },
    });
  } catch (error) {
    console.error("Faculty login error:", error);

    res.status(500).json({
      message: "Faculty login failed",
    });
  }
};
module.exports = {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin,
  loginFaculty,
};