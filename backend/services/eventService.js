const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Crea un nuovo evento
 */
const createEvent = async (data, userId) => {
  return await Event.create({ ...data, createdBy: userId });
};

/**
 * Aggiorna un evento esistente
 */
const updateEvent = async (eventId, data, user) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Evento non trovato');

  if (user.userId !== event.createdBy && user.role !== 'admin') {
    throw new Error('Non autorizzato');
  }

  return await event.update(data);
};

/**
 * Cancella un evento
 */
const deleteEvent = async (eventId, user) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Evento non trovato');

  if (user.userId !== event.createdBy && user.role !== 'admin') {
    throw new Error('Non autorizzato');
  }

  await event.destroy();
  return { message: 'Evento cancellato' };
};

/**
 * Lista eventi pubblici con filtri
 */
const listEvents = async (filters = {}) => {
  const where = {};
  if (filters.category) where.category = filters.category;
  if (filters.date) where.date = filters.date;
  if (filters.location) where.location = { [Op.like]: `%${filters.location}%` };

  return await Event.findAll({
    where,
    include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }]
  });
};

/**
 * Iscrizione a un evento
 */
const registerToEvent = async (eventId, userId) => {
  const existing = await Registration.findOne({ where: { eventId, userId } });
  if (existing) throw new Error('Sei già iscritto a questo evento');

  return await Registration.create({ eventId, userId });
};

/**
 * Annulla iscrizione a un evento
 */
const cancelRegistration = async (eventId, userId) => {
  const registration = await Registration.findOne({ where: { eventId, userId } });
  if (!registration) throw new Error('Iscrizione non trovata');

  await registration.destroy();
  return { message: 'Iscrizione annullata' };
};

/**
 * Dashboard personale
 */
const personalDashboard = async (userId) => {
  const createdEvents = await Event.findAll({ where: { createdBy: userId } });

  const registeredEvents = await Registration.findAll({
    where: { userId },
    include: [{ model: Event }]
  });

  return { createdEvents, registeredEvents };
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  registerToEvent,
  cancelRegistration,
  personalDashboard
};
