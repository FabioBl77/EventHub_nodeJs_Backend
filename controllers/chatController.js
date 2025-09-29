const Chat = require('../models/Chat');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * Invia un messaggio in un evento
 */
const sendMessage = async (req, res) => {
  try {
    const { eventId, content } = req.body;

    // Controllo che l'evento esista
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Creazione messaggio
    const message = await Chat.create({
      content,
      eventId,
      userId: req.user.userId
    });

    res.status(201).json({
      message: 'Messaggio inviato',
      chat: message
    });
  } catch (err) {
    console.error('Errore invio messaggio:', err);
    res.status(500).json({ message: 'Errore durante l\'invio del messaggio' });
  }
};

/**
 * Recupera tutti i messaggi di un evento
 */
const getMessagesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Controllo che l'evento esista
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Recupero messaggi con info utente
    const messages = await Chat.findAll({
      where: { eventId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Errore recupero messaggi:', err);
    res.status(500).json({ message: 'Errore durante il recupero dei messaggi' });
  }
};

module.exports = {
  sendMessage,
  getMessagesByEvent
};
