/**
 * MODELS INDEX - EventHub
 * Definisce tutte le relazioni tra i modelli Sequelize
 */

const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Event = require("./Event");
const Registration = require("./Registration");
const Report = require("./Report");

/* -----------------------------------------------------
   RELAZIONI TRA I MODELLI
----------------------------------------------------- */

// USER → EVENT (creatore)
User.hasMany(Event, { foreignKey: "createdBy", as: "createdEvents" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// USER → EVENT tramite REGISTRATION (partecipazioni)
User.belongsToMany(Event, {
  through: Registration,
  foreignKey: "userId",
  as: "registeredEvents",
});

Event.belongsToMany(User, {
  through: Registration,
  foreignKey: "eventId",
  as: "participants",
});

// REGISTRATION relazioni dirette
Registration.belongsTo(User, { foreignKey: "userId", as: "user" });
Registration.belongsTo(Event, { foreignKey: "eventId", as: "event" });

User.hasMany(Registration, { foreignKey: "userId", as: "registrations" });
Event.hasMany(Registration, { foreignKey: "eventId", as: "registrations" });

/* -----------------------------------------------------
   REPORT → deve usare alias user / event
   (per compatibilità con i controller admin)
----------------------------------------------------- */

// Report → User
Report.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Report, { foreignKey: "userId", as: "reports" });

// Report → Event
Report.belongsTo(Event, { foreignKey: "eventId", as: "event" });
Event.hasMany(Report, { foreignKey: "eventId", as: "reports" });

/* -----------------------------------------------------
   EXPORT
----------------------------------------------------- */

module.exports = {
  sequelize,
  Sequelize,
  User,
  Event,
  Registration,
  Report,
};
