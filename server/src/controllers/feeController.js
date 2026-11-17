const prisma = require("../lib/prisma");

const studentSelect = {
  id: true,
  name: true,
  email: true,
  rollNumber: true,
  department: { select: { id: true, name: true } },
  college: { select: { id: true, name: true } },
};

// Adds displayStatus: PAID / PENDING / OVERDUE
const withStatus = (fee) => ({
  ...fee,
  displayStatus:
    fee.status === "PAID"
      ? "PAID"
      : new Date(fee.dueDate) < new Date()
      ? "OVERDUE"
      : "PENDING",
});

const buildSummary = (fees) => {
  const summary = {
    totalAmount: 0,
    collectedAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalCount: fees.length,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
  };

  fees.forEach((fee) => {
    summary.totalAmount += fee.amount;

    if (fee.displayStatus === "PAID") {
      summary.collectedAmount += fee.amount;
      summary.paidCount++;
    } else if (fee.displayStatus === "OVERDUE") {
      summary.overdueAmount += fee.amount;
      summary.overdueCount++;
    } else {
      summary.pendingAmount += fee.amount;
      summary.pendingCount++;
    }
  });

  return summary;
};

// ADMIN: GET ALL FEES (?studentId=&status=)
const getFees = async (req, res) => {
  try {
    const { studentId, status } = req.query;

    const fees = await prisma.fee.findMany({
      where: studentId ? { studentId } : {},
      include: { student: { select: studentSelect } },
      orderBy: { createdAt: "desc" },
    });

    let result = fees.map(withStatus);

    if (status) {
      result = result.filter((fee) => fee.displayStatus === status);
    }

    res.json({ fees: result, summary: buildSummary(fees.map(withStatus)) });
  } catch (error) {
    console.error("Get fees error:", error);
    res.status(500).json({ message: "Failed to fetch fees" });
  }
};

// ADMIN: CREATE FEE (for one student, or for a whole department)
const createFee = async (req, res) => {
  try {
    const { studentId, departmentId, title, amount, dueDate } = req.body;

    if ((!studentId && !departmentId) || !title || !amount || !dueDate) {
      return res.status(400).json({
        message: "Student (or department), title, amount and due date are required",
      });
    }

    const amountNumber = Number(amount);
    const due = new Date(dueDate);

    if (!Number.isInteger(amountNumber) || amountNumber <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive whole number" });
    }

    if (isNaN(due.getTime())) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    if (studentId) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const fee = await prisma.fee.create({
        data: {
          studentId,
          title: title.trim(),
          amount: amountNumber,
          dueDate: due,
        },
        include: { student: { select: studentSelect } },
      });

      return res.status(201).json({
        message: "Fee assigned successfully",
        fee: withStatus(fee),
      });
    }

    const students = await prisma.student.findMany({
      where: { departmentId },
      select: { id: true },
    });

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found in this department" });
    }

    await prisma.fee.createMany({
      data: students.map((student) => ({
        studentId: student.id,
        title: title.trim(),
        amount: amountNumber,
        dueDate: due,
      })),
    });

    res.status(201).json({
      message: `Fee assigned to ${students.length} students`,
      count: students.length,
    });
  } catch (error) {
    console.error("Create fee error:", error);
    res.status(500).json({ message: "Failed to assign fee" });
  }
};

// ADMIN: MARK FEE AS PAID
const markFeePaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const existing = await prisma.fee.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Fee not found" });
    }

    if (existing.status === "PAID") {
      return res.status(400).json({ message: "Fee is already paid" });
    }

    const receiptNumber = `RCPT-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const fee = await prisma.fee.update({
      where: { id: req.params.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paymentMethod: paymentMethod || "CASH",
        receiptNumber,
      },
      include: { student: { select: studentSelect } },
    });

    res.json({
      message: "Fee marked as paid",
      fee: withStatus(fee),
    });
  } catch (error) {
    console.error("Mark fee paid error:", error);
    res.status(500).json({ message: "Failed to update fee" });
  }
};

// ADMIN: DELETE FEE
const deleteFee = async (req, res) => {
  try {
    await prisma.fee.delete({ where: { id: req.params.id } });
    res.json({ message: "Fee deleted successfully" });
  } catch (error) {
    console.error("Delete fee error:", error);
    res.status(400).json({ message: "Failed to delete fee" });
  }
};

// STUDENT: GET MY FEES
const getMyFees = async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { studentId: req.user.id },
      orderBy: { dueDate: "asc" },
    });

    const result = fees.map(withStatus);

    res.json({ fees: result, summary: buildSummary(result) });
  } catch (error) {
    console.error("Get my fees error:", error);
    res.status(500).json({ message: "Failed to fetch your fees" });
  }
};

// STUDENT: GET ONE OF MY FEES (used for receipt)
const getMyFeeById = async (req, res) => {
  try {
    const fee = await prisma.fee.findFirst({
      where: { id: req.params.id, studentId: req.user.id },
      include: { student: { select: studentSelect } },
    });

    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    res.json(withStatus(fee));
  } catch (error) {
    console.error("Get my fee error:", error);
    res.status(500).json({ message: "Failed to fetch fee" });
  }
};

module.exports = {
  getFees,
  createFee,
  markFeePaid,
  deleteFee,
  getMyFees,
  getMyFeeById,
};