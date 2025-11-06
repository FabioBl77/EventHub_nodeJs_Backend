const Message = require('../models/Message');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * Invia un messaggio in chat di un evento
 */
const sendMessage = async (eventId, userId, content) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Evento non trovato');

  const message = await Message.create({ eventId, userId, content });
  return message;
};

/**
 * Recupera tutti i messaggi di un evento
 */
const getMessages = async (eventId) => {
  const messages = await Message.findAll({
    where: { eventId },
    include: [{ model: User, attributes: ['id', 'username'] }],
    order: [['createdAt', 'ASC']]
  });

  return messages;
};

module.exports = {
  sendMessage,
  getMessages
};
