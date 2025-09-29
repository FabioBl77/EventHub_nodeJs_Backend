const User = require('./User');
const Event = require('./Event');
const Message = require('./Message');
const Registration = require('./Registration');

// Relazioni
User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Event.hasMany(Message, { foreignKey: 'eventId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(Event, { through: Registration, foreignKey: 'userId', as: 'registeredEvents' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'eventId', as: 'participants' });

module.exports = { User, Event, Message, Registration };
