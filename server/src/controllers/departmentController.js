const prisma = require("../lib/prisma");

// CREATE
const createDepartment = async (req, res) => {
  try {
    const { name, code, collegeId } = req.body;

    if (!name || !code || !collegeId) {
      return res.status(400).json({
        message: "Name, code and college are required",
      });
    }

    const department = await prisma.department.create({
      data: { name, code, collegeId },
      include: { college: true },
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({
      message: "Failed to create department. Check department code and college.",
    });
  }
};

// GET ALL
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        college: true,
        courses: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(departments);
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

// UPDATE
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, collegeId } = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: { name, code, collegeId },
      include: { college: true },
    });

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({
      message: "Failed to update department",
    });
  }
};

// DELETE
const deleteDepartment = async (req, res) => {
  try {
    await prisma.department.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(400).json({
      message: "Cannot delete department. Remove its courses, students and faculty first.",
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};