const prisma = require("../lib/prisma");

const isUpcoming = (event) => new Date(event.date) >= new Date();

// ALL ROLES: LIST EVENTS (?clubId=)
const getEvents = async (req, res) => {
  try {
    const { clubId } = req.query;

    const events = await prisma.event.findMany({
      where: clubId ? { clubId } : {},
      include: {
        club: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { date: "asc" },
    });

    // Events the logged-in student registered for (empty for admin/faculty)
    const registrations = await prisma.eventRegistration.findMany({
      where: { studentId: req.user.id },
      select: { eventId: true },
    });

    const registeredIds = new Set(registrations.map((item) => item.eventId));

    res.json(
      events.map(({ _count, ...event }) => ({
        ...event,
        registrationCount: _count.registrations,
        isUpcoming: isUpcoming(event),
        registered: registeredIds.has(event.id),
      }))
    );
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// ADMIN: CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, clubId } = req.body;

    if (!title || !description || !venue || !date) {
      return res.status(400).json({
        message: "Title, description, venue and date are required",
      });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    if (clubId) {
      const club = await prisma.club.findUnique({ where: { id: clubId } });
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        venue: venue.trim(),
        date: eventDate,
        clubId: clubId || null,
      },
      include: { club: { select: { id: true, name: true } } },
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// ADMIN: UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { title, description, venue, date, clubId } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description.trim();
    if (venue !== undefined) data.venue = venue.trim();
    if (clubId !== undefined) data.clubId = clubId || null;

    if (date !== undefined) {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
      }
      data.date = eventDate;
    }

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data,
      include: { club: { select: { id: true, name: true } } },
    });

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(400).json({ message: "Failed to update event" });
  }
};

// ADMIN: DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(400).json({ message: "Failed to delete event" });
  }
};

// ADMIN: LIST REGISTRATIONS OF AN EVENT
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.id },
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

    res.json(registrations);
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

// STUDENT: REGISTER FOR EVENT
const registerForEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!isUpcoming(event)) {
      return res.status(400).json({ message: "This event has already ended" });
    }

    await prisma.eventRegistration.create({
      data: { eventId: event.id, studentId: req.user.id },
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "You are already registered for this event" });
    }

    console.error("Register event error:", error);
    res.status(500).json({ message: "Failed to register" });
  }
};

// STUDENT: CANCEL REGISTRATION
const unregisterFromEvent = async (req, res) => {
  try {
    const result = await prisma.eventRegistration.deleteMany({
      where: { eventId: req.params.id, studentId: req.user.id },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "You are not registered for this event" });
    }

    res.json({ message: "Registration cancelled" });
  } catch (error) {
    console.error("Unregister event error:", error);
    res.status(500).json({ message: "Failed to cancel registration" });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  registerForEvent,
  unregisterFromEvent,
};