const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');

class Chat extends Model {}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chats',
    timestamps: true
  }
);

// Associazioni
Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Chat.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = Chat;
