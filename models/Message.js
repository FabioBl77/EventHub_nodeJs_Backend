const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  }
}, {
  tableName: 'messages',
  timestamps: true
});

// Relazioni
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(Message, { foreignKey: 'eventId' });
Message.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Message;
