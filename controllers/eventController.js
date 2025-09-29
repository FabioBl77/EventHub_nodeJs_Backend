// controllers/eventController.js
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const notificationController = require('./notificationController');

// 📌 Crea un nuovo evento
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, image } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      image,
      createdBy: req.user.userId
    });

    res.status(201).json(event);
  } catch (err) {
    console.error('Errore createEvent:', err);
    res.status(500).json({ message: 'Errore creazione evento' });
  }
};

// 📌 Recupera tutti gli eventi
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }]
    });
    res.status(200).json(events);
  } catch (err) {
    console.error('Errore getAllEvents:', err);
    res.status(500).json({ message: 'Errore recupero eventi' });
  }
};

// 📌 Recupera evento per ID
const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }]
    });

    if (!event) return res.status(404).json({ message: 'Evento non trovato' });
    res.status(200).json(event);
  } catch (err) {
    console.error('Errore getEventById:', err);
    res.status(500).json({ message: 'Errore recupero evento' });
  }
};

// 📌 Aggiorna evento
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location, capacity, image } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Evento non trovato' });

    if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    await event.update({ title, description, date, location, capacity, image });
    res.status(200).json(event);
  } catch (err) {
    console.error('Errore updateEvent:', err);
    res.status(500).json({ message: 'Errore aggiornamento evento' });
  }
};

// 📌 Elimina evento
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Evento non trovato' });

    if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Evento eliminato' });
  } catch (err) {
    console.error('Errore deleteEvent:', err);
    res.status(500).json({ message: 'Errore eliminazione evento' });
  }
};

// 📌 Iscrizione a un evento
const registerToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Controlla se già iscritto
    const existing = await Registration.findOne({
      where: { userId: req.user.userId, eventId }
    });
    if (existing) return res.status(400).json({ message: 'Sei già iscritto a questo evento' });

    const registration = await Registration.create({
      userId: req.user.userId,
      eventId
    });

    // Recupera dati utente ed evento
    const user = await User.findByPk(req.user.userId, { attributes: ['id', 'username'] });
    const event = await Event.findByPk(eventId, { attributes: ['id', 'title', 'createdBy'] });

    const username = user?.username || `utente#${req.user.userId}`;

    if (event?.createdBy) {
      await notificationController.sendNotification({
        userId: event.createdBy,
        content: `${username} si è iscritto all'evento ${event.title}`
      }, req);
    }

    res.status(201).json({ message: 'Iscrizione avvenuta', registration });
  } catch (err) {
    console.error('Errore registerToEvent:', err);
    res.status(500).json({ message: 'Errore iscrizione evento' });
  }
};

// 📌 Annulla iscrizione
const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      where: { userId: req.user.userId, eventId }
    });
    if (!registration) return res.status(404).json({ message: 'Iscrizione non trovata' });

    await registration.destroy();

    const user = await User.findByPk(req.user.userId, { attributes: ['id', 'username'] });
    const event = await Event.findByPk(eventId, { attributes: ['id', 'title', 'createdBy'] });

    const username = user?.username || `utente#${req.user.userId}`;

    if (event?.createdBy) {
      await notificationController.sendNotification({
        userId: event.createdBy,
        content: `${username} ha annullato l'iscrizione all'evento ${event.title}`
      }, req);
    }

    res.status(200).json({ message: 'Iscrizione annullata' });
  } catch (err) {
    console.error('Errore cancelRegistration:', err);
    res.status(500).json({ message: 'Errore annullamento iscrizione' });
  }
};

// 📌 Segnala evento (notifica agli admin)
const reportEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Evento non trovato' });

    const user = await User.findByPk(req.user.userId, { attributes: ['id', 'username'] });
    const username = user?.username || `utente#${req.user.userId}`;

    await notificationController.sendNotification({
      content: `${username} ha segnalato l'evento ${event.title}`,
      broadcastToAdmins: true
    }, req);

    res.status(200).json({ message: 'Evento segnalato agli admin' });
  } catch (err) {
    console.error('Errore reportEvent:', err);
    res.status(500).json({ message: 'Errore nella segnalazione evento' });
  }
};

// 📌 Dashboard personale
const personalDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const createdEvents = await Event.findAll({ where: { createdBy: userId } });
    const registrations = await Registration.findAll({ where: { userId } });

    res.status(200).json({
      createdEvents,
      registrations
    });
  } catch (err) {
    console.error('Errore personalDashboard:', err);
    res.status(500).json({ message: 'Errore nel recupero dashboard personale' });
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
  personalDashboard
};
