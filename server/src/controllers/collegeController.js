const prisma = require("../lib/prisma");

const createCollege = async (req, res) => {
  try {
    const { name, code, email } = req.body;

    const college = await prisma.college.create({
      data: { name, code, email },
    });

    res.status(201).json({
      message: "College created successfully",
      college,
    });
  } catch (error) {
    console.error("Create college error:", error);
    res.status(500).json({ message: "Failed to create college" });
  }
};

const getColleges = async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      include: { departments: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(colleges);
  } catch (error) {
    console.error("Get colleges error:", error);
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};

const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, email } = req.body;

    const college = await prisma.college.update({
      where: { id },
      data: { name, code, email },
    });

    res.json({ message: "College updated successfully", college });
  } catch (error) {
    console.error("Update college error:", error);
    res.status(500).json({ message: "Failed to update college" });
  }
};

const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.college.delete({ where: { id } });

    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Delete college error:", error);
    res.status(400).json({
      message: "Cannot delete college. Remove its departments, students and faculty first.",
    });
  }
};

module.exports = {
  createCollege,
  getColleges,
  updateCollege,
  deleteCollege,
};