const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');

class Registration extends Model {}

Registration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }, // rimane Users
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'events', key: 'id' }, // <- corretto: 'events' minuscolo
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Registration',
    tableName: 'Registrations',
    timestamps: true
  }
);

// Associazioni
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = Registration;
