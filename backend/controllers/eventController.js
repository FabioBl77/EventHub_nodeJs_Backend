const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Chat = require("../models/Chat");
const notificationController = require("./notificationController");
const { Op } = require("sequelize");

// 📌 Crea un nuovo evento (e iscrive automaticamente il creatore)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, category, image } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      image,
      category,
      createdBy: req.user.userId,
    });

    await Registration.create({
      userId: req.user.userId,
      eventId: event.id,
    });

    res.status(201).json({
      message: "Evento creato e autore iscritto automaticamente",
      event,
    });
  } catch (err) {
    console.error("Errore createEvent:", err);
    res.status(500).json({ message: "Errore nella creazione dell'evento" });
  }
};

// 📌 Recupera tutti gli eventi (gli eventi bloccati non sono visibili ai normali utenti)
const getAllEvents = async (req, res) => {
  try {
    const where = {};

    // Solo admin vede eventi bloccati
    if (!req.user || req.user.role !== "admin") {
      where.isBlocked = false;
    }

    const events = await Event.findAll({
      where,
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
    });

    let userRegistrations = [];
    if (req.user) {
      const regs = await Registration.findAll({
        where: { userId: req.user.userId },
        attributes: ["eventId"],
      });
      userRegistrations = regs.map((r) => r.eventId);
    }

    const enrichedEvents = events.map((event) => ({
      ...event.toJSON(),
      isUserRegistered: userRegistrations.includes(event.id),
    }));

    res.status(200).json(enrichedEvents);
  } catch (err) {
    console.error("Errore getAllEvents:", err);
    res.status(500).json({ message: "Errore recupero eventi" });
  }
};

// 📌 Recupera evento per ID (bloccato → visibile solo agli admin)
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
    });

    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    // Utenti NON admin non devono vedere eventi bloccati
    if (event.isBlocked && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ message: "Questo evento è stato bloccato dagli amministratori" });
    }

    let isUserRegistered = false;
    if (req.user) {
      const registration = await Registration.findOne({
        where: { userId: req.user.userId, eventId },
      });
      isUserRegistered = !!registration;
    }

    res.status(200).json({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      category: event.category,
      image: event.image,
      creatorId: event.creator ? event.creator.id : null,
      creatorName: event.creator ? event.creator.username : "Sconosciuto",
      isUserRegistered,
      createdBy: event.createdBy,
      isBlocked: event.isBlocked,
    });
  } catch (err) {
    console.error("Errore getEventById:", err);
    res.status(500).json({ message: "Errore recupero evento" });
  }
};

// 📌 Aggiorna evento
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location, capacity, category, image } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    if (event.createdBy !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    await event.update({ title, description, date, location, capacity, category, image });
    res.status(200).json(event);
  } catch (err) {
    console.error("Errore updateEvent:", err);
    res.status(500).json({ message: "Errore aggiornamento evento" });
  }
};

// 📌 Elimina evento
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    if (event.createdBy !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    await event.destroy();
    res.status(200).json({ message: "Evento eliminato" });
  } catch (err) {
    console.error("Errore deleteEvent:", err);
    res.status(500).json({ message: "Errore eliminazione evento" });
  }
};

// 📌 Iscrizione a un evento (con messaggio chat)
const registerToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const existing = await Registration.findOne({
      where: { userId: req.user.userId, eventId },
    });
    if (existing) return res.status(400).json({ message: "Sei già iscritto a questo evento" });

    const registration = await Registration.create({
      userId: req.user.userId,
      eventId,
    });

    const user = await User.findByPk(req.user.userId, { attributes: ["id", "username"] });
    const event = await Event.findByPk(eventId, { attributes: ["id", "title", "createdBy"] });
    const username = user?.username || `utente#${req.user.userId}`;

    const io = req.app.get("io");
    const messageText = `${username} si è iscritto all'evento "${event.title}"`;

    await Chat.create({
      content: messageText,
      eventId,
      userId: null,
    });

    if (io) {
      io.to(`event_${eventId}`).emit("new_message", {
        eventId,
        message: messageText,
        userId: 0,
        username: "Sistema",
        timestamp: new Date(),
      });
    }

    if (event?.createdBy) {
      await notificationController.sendNotification(
        {
          userId: event.createdBy,
          content: `${username} si è iscritto all'evento ${event.title}`,
        },
        req
      );
    }

    res.status(201).json({ message: "Iscrizione avvenuta", registration });
  } catch (err) {
    console.error("Errore registerToEvent:", err);
    res.status(500).json({ message: "Errore iscrizione evento" });
  }
};

// 📌 Annulla iscrizione
const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      where: { userId: req.user.userId, eventId },
    });
    if (!registration)
      return res.status(404).json({ message: "Iscrizione non trovata" });

    await registration.destroy();

    const user = await User.findByPk(req.user.userId, { attributes: ["id", "username"] });
    const event = await Event.findByPk(eventId, { attributes: ["id", "title", "createdBy"] });
    const username = user?.username || `utente#${req.user.userId}`;

    const io = req.app.get("io");
    const messageText = `${username} ha annullato l'iscrizione all'evento "${event.title}"`;

    await Chat.create({
      content: messageText,
      eventId,
      userId: null
    });

    if (io) {
      io.to(`event_${eventId}`).emit("new_message", {
        eventId,
        message: messageText,
        userId: 0,
        username: "Sistema",
        timestamp: new Date(),
      });
    }

    if (event?.createdBy) {
      await notificationController.sendNotification(
        {
          userId: event.createdBy,
          content: `${username} ha annullato l'iscrizione all'evento ${event.title}`,
        },
        req
      );
    }

    res.status(200).json({ message: "Iscrizione annullata" });
  } catch (err) {
    console.error("Errore cancelRegistration:", err);
    res.status(500).json({ message: "Errore annullamento iscrizione" });
  }
};

// 📌 Segnala evento
const reportEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const user = await User.findByPk(req.user.userId, { attributes: ["id", "username"] });
    const username = user?.username || `utente#${req.user.userId}`;

    await notificationController.sendNotification(
      {
        content: `${username} ha segnalato l'evento ${event.title}`,
        broadcastToAdmins: true,
      },
      req
    );

    res.status(200).json({ message: "Evento segnalato agli admin" });
  } catch (err) {
    console.error("Errore reportEvent:", err);
    res.status(500).json({ message: "Errore nella segnalazione evento" });
  }
};

// 📌 Dashboard personale (non mostra eventi bloccati agli utenti)
const personalDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const createdEvents = await Event.findAll({
      where: { createdBy: userId },
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
    });

    const registrations = await Registration.findAll({
      where: { userId },
      include: [
        {
          model: Event,
          as: "event",
          include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
        },
      ],
    });

    const joinedEvents = registrations.map((r) => ({
      ...r.event.toJSON(),
      isUserRegistered: true,
    }));

    const createdEventsWithFlag = createdEvents.map((e) => ({
      ...e.toJSON(),
      isUserRegistered: false,
    }));

    // 🔒 Nascondi eventi bloccati agli utenti non admin
    const joinedEventsFiltered =
      req.user.role === "admin"
        ? joinedEvents
        : joinedEvents.filter((ev) => !ev.isBlocked);

    const createdEventsFiltered =
      req.user.role === "admin"
        ? createdEventsWithFlag
        : createdEventsWithFlag.filter((ev) => !ev.isBlocked);

    res.status(200).json({
      createdEvents: createdEventsFiltered,
      joinedEvents: joinedEventsFiltered,
    });
  } catch (err) {
    console.error("Errore personalDashboard:", err);
    res.status(500).json({ message: "Errore nel recupero dashboard personale" });
  }
};

// Filtra eventi (gli utenti non admin non vedono eventi bloccati)
const filterEvents = async (req, res) => {
  try {
    const { date, category, location } = req.query;

    const filters = {};

    // Applica filtri normali
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filters.date = { [Op.between]: [start, end] };
    }

    if (category) filters.category = category;
    if (location) filters.location = location;

    // Nascondi eventi bloccati agli utenti normali
    if (!req.user || req.user.role !== "admin") {
      filters.isBlocked = false;
    }

    const events = await Event.findAll({
      where: filters,
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }],
    });

    res.status(200).json(events);
  } catch (err) {
    console.error("Errore filterEvents:", err);
    res.status(500).json({ message: "Errore nel filtraggio eventi" });
  }
};


module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerToEvent,
  cancelRegistration,
  reportEvent,
  personalDashboard,
  filterEvents,
};
