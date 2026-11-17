const prisma = require("../lib/prisma");

// PUBLIC: SUBMIT ALUMNI REQUEST (no auth)
const submitAlumniRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      graduationYear,
      departmentId,
      collegeId,
      company,
      jobTitle,
      location,
      linkedin,
      bio,
    } = req.body;

    if (!name || !email || !graduationYear || !departmentId || !collegeId) {
      return res.status(400).json({
        message:
          "Name, email, graduation year, department and college are required",
      });
    }

    const year = parseInt(graduationYear, 10);
    if (isNaN(year) || year < 1950 || year > 2100) {
      return res.status(400).json({ message: "Invalid graduation year" });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const existingAlumni = await prisma.alumni.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existingAlumni) {
      return res
        .status(409)
        .json({ message: "An alumni with this email already exists" });
    }

    const existingRequest = await prisma.alumniRequest.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return res.status(409).json({
          message: "A request with this email is already pending approval",
        });
      }

      const updated = await prisma.alumniRequest.update({
        where: { id: existingRequest.id },
        data: {
          name: name.trim(),
          phone: phone?.trim() || null,
          graduationYear: year,
          departmentId,
          collegeId,
          company: company?.trim() || null,
          jobTitle: jobTitle?.trim() || null,
          location: location?.trim() || null,
          linkedin: linkedin?.trim() || null,
          bio: bio?.trim() || null,
          status: "PENDING",
        },
      });

      return res.status(201).json({
        message: "Alumni request resubmitted for approval",
        request: updated,
      });
    }

    const request = await prisma.alumniRequest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        graduationYear: year,
        departmentId,
        collegeId,
        company: company?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        location: location?.trim() || null,
        linkedin: linkedin?.trim() || null,
        bio: bio?.trim() || null,
      },
    });

    res.status(201).json({
      message: "Alumni request submitted. Admin will review it.",
      request,
    });
  } catch (error) {
    console.error("Submit alumni request error:", error);
    res.status(500).json({ message: "Failed to submit request" });
  }
};

// PUBLIC: COLLEGES + DEPARTMENTS FOR THE FORM
const getPublicOptions = async (req, res) => {
  try {
    const [colleges, departments] = await Promise.all([
      prisma.college.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.department.findMany({
        select: { id: true, name: true, collegeId: true },
        orderBy: { name: "asc" },
      }),
    ]);

    res.json({ colleges, departments });
  } catch (error) {
    console.error("Get public options error:", error);
    res.status(500).json({ message: "Failed to fetch options" });
  }
};

// ADMIN: LIST ALUMNI REQUESTS (?status=)
const getAlumniRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const requests = await prisma.alumniRequest.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });

    const departmentIds = [...new Set(requests.map((r) => r.departmentId))];
    const collegeIds = [...new Set(requests.map((r) => r.collegeId))];

    const [departments, colleges] = await Promise.all([
      prisma.department.findMany({
        where: { id: { in: departmentIds } },
        select: { id: true, name: true },
      }),
      prisma.college.findMany({
        where: { id: { in: collegeIds } },
        select: { id: true, name: true },
      }),
    ]);

    const deptMap = new Map(departments.map((d) => [d.id, d.name]));
    const collegeMap = new Map(colleges.map((c) => [c.id, c.name]));

    res.json(
      requests.map((r) => ({
        ...r,
        departmentName: deptMap.get(r.departmentId) || null,
        collegeName: collegeMap.get(r.collegeId) || null,
      }))
    );
  } catch (error) {
    console.error("Get alumni requests error:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// ADMIN: APPROVE REQUEST (creates Alumni)
const approveAlumniRequest = async (req, res) => {
  try {
    const request = await prisma.alumniRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "APPROVED") {
      return res.status(400).json({ message: "Request is already approved" });
    }

    const existingAlumni = await prisma.alumni.findUnique({
      where: { email: request.email },
    });

    if (existingAlumni) {
      await prisma.alumniRequest.update({
        where: { id: request.id },
        data: { status: "APPROVED" },
      });

      return res
        .status(409)
        .json({ message: "Alumni with this email already exists" });
    }

    const [alumni] = await prisma.$transaction([
      prisma.alumni.create({
        data: {
          name: request.name,
          email: request.email,
          phone: request.phone,
          graduationYear: request.graduationYear,
          departmentId: request.departmentId,
          collegeId: request.collegeId,
          company: request.company,
          jobTitle: request.jobTitle,
          location: request.location,
          linkedin: request.linkedin,
          bio: request.bio,
        },
      }),
      prisma.alumniRequest.update({
        where: { id: request.id },
        data: { status: "APPROVED" },
      }),
    ]);

    res.json({ message: "Alumni request approved", alumni });
  } catch (error) {
    console.error("Approve request error:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

// ADMIN: REJECT REQUEST
const rejectAlumniRequest = async (req, res) => {
  try {
    const request = await prisma.alumniRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await prisma.alumniRequest.update({
      where: { id: request.id },
      data: { status: "REJECTED" },
    });

    res.json({ message: "Alumni request rejected" });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

// ALL LOGGED IN: LIST ALUMNI (directory)
const getAlumni = async (req, res) => {
  try {
    const { departmentId, graduationYear, search } = req.query;

    const where = {};

    if (departmentId) where.departmentId = departmentId;
    if (graduationYear) {
      const year = parseInt(graduationYear, 10);
      if (!isNaN(year)) where.graduationYear = year;
    }
    if (search) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { jobTitle: { contains: query, mode: "insensitive" } },
      ];
    }

    const alumni = await prisma.alumni.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        college: { select: { id: true, name: true } },
      },
      orderBy: [{ graduationYear: "desc" }, { name: "asc" }],
    });

    res.json(alumni);
  } catch (error) {
    console.error("Get alumni error:", error);
    res.status(500).json({ message: "Failed to fetch alumni" });
  }
};

// ADMIN: CREATE ALUMNI DIRECTLY
const createAlumni = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      graduationYear,
      departmentId,
      collegeId,
      company,
      jobTitle,
      location,
      linkedin,
      bio,
      profilePhoto,
    } = req.body;

    if (!name || !email || !graduationYear || !departmentId || !collegeId) {
      return res.status(400).json({
        message:
          "Name, email, graduation year, department and college are required",
      });
    }

    const year = parseInt(graduationYear, 10);
    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid graduation year" });
    }

    const alumni = await prisma.alumni.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        graduationYear: year,
        departmentId,
        collegeId,
        company: company?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        location: location?.trim() || null,
        linkedin: linkedin?.trim() || null,
        bio: bio?.trim() || null,
        profilePhoto: profilePhoto || null,
      },
    });

    res.status(201).json({ message: "Alumni created successfully", alumni });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "An alumni with this email already exists" });
    }

    console.error("Create alumni error:", error);
    res.status(500).json({ message: "Failed to create alumni" });
  }
};

// ADMIN: UPDATE ALUMNI
const updateAlumni = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      graduationYear,
      departmentId,
      collegeId,
      company,
      jobTitle,
      location,
      linkedin,
      bio,
      profilePhoto,
    } = req.body;

    const data = {};

    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email.trim().toLowerCase();
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (graduationYear !== undefined) {
      const year = parseInt(graduationYear, 10);
      if (isNaN(year)) {
        return res.status(400).json({ message: "Invalid graduation year" });
      }
      data.graduationYear = year;
    }
    if (departmentId !== undefined) data.departmentId = departmentId;
    if (collegeId !== undefined) data.collegeId = collegeId;
    if (company !== undefined) data.company = company?.trim() || null;
    if (jobTitle !== undefined) data.jobTitle = jobTitle?.trim() || null;
    if (location !== undefined) data.location = location?.trim() || null;
    if (linkedin !== undefined) data.linkedin = linkedin?.trim() || null;
    if (bio !== undefined) data.bio = bio?.trim() || null;
    if (profilePhoto !== undefined) data.profilePhoto = profilePhoto || null;

    const alumni = await prisma.alumni.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: "Alumni updated successfully", alumni });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "An alumni with this email already exists" });
    }

    console.error("Update alumni error:", error);
    res.status(400).json({ message: "Failed to update alumni" });
  }
};

// ADMIN: DELETE ALUMNI
const deleteAlumni = async (req, res) => {
  try {
    await prisma.alumni.delete({ where: { id: req.params.id } });
    res.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error("Delete alumni error:", error);
    res.status(400).json({ message: "Failed to delete alumni" });
  }
};

module.exports = {
  submitAlumniRequest,
  getPublicOptions,
  getAlumniRequests,
  approveAlumniRequest,
  rejectAlumniRequest,
  getAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
};