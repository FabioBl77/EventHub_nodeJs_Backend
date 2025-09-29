const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  image: {
    type: DataTypes.STRING, // URL o path immagine
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'events',
  timestamps: true
});

// Relazioni
Event.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Event, { foreignKey: 'createdBy' });

module.exports = Event;
