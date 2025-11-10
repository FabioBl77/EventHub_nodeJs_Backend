/**
 * MODELS INDEX - EventHub
 * Definisce tutte le relazioni tra i modelli Sequelize
 */

const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import modelli
const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');

// ✅ Se hai già la chat (Message.js), decommenta questa riga
// const Message = require('./Message');

/* -----------------------------------------------------
   🔗 RELAZIONI TRA I MODELLI
----------------------------------------------------- */

// 🔹 1. USER ↔ EVENT (creatore evento)
User.hasMany(Event, { foreignKey: 'createdBy', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// 🔹 2. USER ↔ EVENT (tramite REGISTRATION → iscrizioni)
User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'userId',
  as: 'registeredEvents',
});

Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'eventId',
  as: 'participants',
});

// 🔹 3. REGISTRATION ↔ RELAZIONI DIRETTE
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

User.hasMany(Registration, { foreignKey: 'userId', as: 'registrations' });
Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });

// 🔹 4. EVENT ↔ MESSAGE (solo se hai la chat attiva)
/*
if (Message) {
  Event.hasMany(Message, { foreignKey: 'eventId', as: 'messages' });
  Message.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
  Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}
*/

/* -----------------------------------------------------
   🧩 EXPORT
----------------------------------------------------- */
module.exports = {
  sequelize,
  Sequelize,
  User,
  Event,
  Registration,
  // Message, // se lo usi in futuro
};
