const prisma = require("../lib/prisma");

// ALL ROLES: LIST CLUBS
const getClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: { _count: { select: { members: true, events: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Clubs the logged-in student has joined (empty for admin/faculty)
    const memberships = await prisma.clubMember.findMany({
      where: { studentId: req.user.id },
      select: { clubId: true },
    });

    const joinedIds = new Set(memberships.map((item) => item.clubId));

    res.json(
      clubs.map(({ _count, ...club }) => ({
        ...club,
        memberCount: _count.members,
        eventCount: _count.events,
        joined: joinedIds.has(club.id),
      }))
    );
  } catch (error) {
    console.error("Get clubs error:", error);
    res.status(500).json({ message: "Failed to fetch clubs" });
  }
};

// ADMIN: CREATE CLUB
const createClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: "Name, description and category are required" });
    }

    const club = await prisma.club.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
      },
    });

    res.status(201).json({ message: "Club created successfully", club });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "A club with this name already exists" });
    }

    console.error("Create club error:", error);
    res.status(500).json({ message: "Failed to create club" });
  }
};

// ADMIN: UPDATE CLUB
const updateClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (category !== undefined) data.category = category.trim();

    const club = await prisma.club.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: "Club updated successfully", club });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "A club with this name already exists" });
    }

    console.error("Update club error:", error);
    res.status(400).json({ message: "Failed to update club" });
  }
};

// ADMIN: DELETE CLUB
const deleteClub = async (req, res) => {
  try {
    await prisma.club.delete({ where: { id: req.params.id } });
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Delete club error:", error);
    res.status(400).json({ message: "Failed to delete club" });
  }
};

// ADMIN: LIST MEMBERS OF A CLUB
const getClubMembers = async (req, res) => {
  try {
    const members = await prisma.clubMember.findMany({
      where: { clubId: req.params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(members);
  } catch (error) {
    console.error("Get club members error:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// STUDENT: JOIN CLUB
const joinClub = async (req, res) => {
  try {
    const club = await prisma.club.findUnique({ where: { id: req.params.id } });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    await prisma.clubMember.create({
      data: { clubId: club.id, studentId: req.user.id },
    });

    res.status(201).json({ message: "Joined club successfully" });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "You are already a member of this club" });
    }

    console.error("Join club error:", error);
    res.status(500).json({ message: "Failed to join club" });
  }
};

// STUDENT: LEAVE CLUB
const leaveClub = async (req, res) => {
  try {
    const result = await prisma.clubMember.deleteMany({
      where: { clubId: req.params.id, studentId: req.user.id },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "You are not a member of this club" });
    }

    res.json({ message: "Left club successfully" });
  } catch (error) {
    console.error("Leave club error:", error);
    res.status(500).json({ message: "Failed to leave club" });
  }
};

module.exports = {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getClubMembers,
  joinClub,
  leaveClub,
};