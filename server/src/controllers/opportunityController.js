const prisma = require("../lib/prisma");

const TYPES = ["PLACEMENT", "INTERNSHIP", "SCHOLARSHIP", "WORKSHOP"];
const STATUSES = ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"];

const isOpen = (opportunity) => new Date(opportunity.deadline) >= new Date();

// ALL ROLES: LIST OPPORTUNITIES (?type=)
const getOpportunities = async (req, res) => {
  try {
    const { type } = req.query;

    const opportunities = await prisma.opportunity.findMany({
      where: type ? { type } : {},
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    });

    // If the logged-in user is a student, find what they already applied to.
    // (For admin/faculty this simply returns nothing.)
    const myApplications = await prisma.opportunityApplication.findMany({
      where: { studentId: req.user.id },
      select: { opportunityId: true, status: true },
    });

    const myMap = new Map(
      myApplications.map((item) => [item.opportunityId, item.status])
    );

    const result = opportunities.map(({ _count, ...item }) => ({
      ...item,
      applicantCount: _count.applications,
      isOpen: isOpen(item),
      applied: myMap.has(item.id),
      myStatus: myMap.get(item.id) || null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get opportunities error:", error);
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

// ADMIN: CREATE
const createOpportunity = async (req, res) => {
  try {
    const { title, type, organization, description, location, benefit, link, deadline } =
      req.body;

    if (!title || !type || !organization || !description || !deadline) {
      return res.status(400).json({
        message: "Title, type, organization, description and deadline are required",
      });
    }

    if (!TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid opportunity type" });
    }

    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid deadline" });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title: title.trim(),
        type,
        organization: organization.trim(),
        description: description.trim(),
        location: location?.trim() || null,
        benefit: benefit?.trim() || null,
        link: link?.trim() || null,
        deadline: date,
      },
    });

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity,
    });
  } catch (error) {
    console.error("Create opportunity error:", error);
    res.status(500).json({ message: "Failed to create opportunity" });
  }
};

// ADMIN: UPDATE
const updateOpportunity = async (req, res) => {
  try {
    const { title, type, organization, description, location, benefit, link, deadline } =
      req.body;

    if (type && !TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid opportunity type" });
    }

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (type !== undefined) data.type = type;
    if (organization !== undefined) data.organization = organization.trim();
    if (description !== undefined) data.description = description.trim();
    if (location !== undefined) data.location = location?.trim() || null;
    if (benefit !== undefined) data.benefit = benefit?.trim() || null;
    if (link !== undefined) data.link = link?.trim() || null;

    if (deadline !== undefined) {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid deadline" });
      }
      data.deadline = date;
    }

    const opportunity = await prisma.opportunity.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: "Opportunity updated successfully", opportunity });
  } catch (error) {
    console.error("Update opportunity error:", error);
    res.status(400).json({ message: "Failed to update opportunity" });
  }
};

// ADMIN: DELETE
const deleteOpportunity = async (req, res) => {
  try {
    await prisma.opportunity.delete({ where: { id: req.params.id } });
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("Delete opportunity error:", error);
    res.status(400).json({ message: "Failed to delete opportunity" });
  }
};

// ADMIN: LIST APPLICANTS OF ONE OPPORTUNITY
const getApplications = async (req, res) => {
  try {
    const applications = await prisma.opportunityApplication.findMany({
      where: { opportunityId: req.params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            phone: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// ADMIN: UPDATE APPLICATION STATUS
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await prisma.opportunityApplication.update({
      where: { id: req.params.applicationId },
      data: { status },
    });

    res.json({ message: "Status updated successfully", application });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(400).json({ message: "Failed to update status" });
  }
};

// STUDENT: APPLY
const applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
    });

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (!isOpen(opportunity)) {
      return res
        .status(400)
        .json({ message: "The deadline for this opportunity has passed" });
    }

    const application = await prisma.opportunityApplication.create({
      data: { opportunityId: opportunity.id, studentId: req.user.id },
    });

    res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "You have already applied to this opportunity" });
    }

    console.error("Apply error:", error);
    res.status(500).json({ message: "Failed to apply" });
  }
};

// STUDENT: MY APPLICATIONS
const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.opportunityApplication.findMany({
      where: { studentId: req.user.id },
      include: { opportunity: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ message: "Failed to fetch your applications" });
  }
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getApplications,
  updateApplicationStatus,
  applyToOpportunity,
  getMyApplications,
};