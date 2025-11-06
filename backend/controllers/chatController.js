const Chat = require('../models/Chat');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * 📌 Invia un messaggio in un evento (salva su DB + invia in real-time)
 * Route: POST /events/:eventId/chat
 * Body: { content: string }
 */
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { eventId } = req.params;

    // Controllo che l'evento esista
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    // Creazione messaggio nel DB
    const message = await Chat.create({
      content,
      eventId,
      userId: req.user.userId
    });

    // Recupero username per la notifica live
    const user = await User.findByPk(req.user.userId, { attributes: ['id', 'username'] });

    // Emissione messaggio in tempo reale tramite Socket.IO
    const io = req.app.get('io');
    io.to(`event_${eventId}`).emit('new_message', {
      id: message.id,
      content: message.content,
      userId: message.userId,
      username: user?.username || `utente#${message.userId}`,
      createdAt: message.createdAt
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
 * 📌 Recupera tutti i messaggi di un evento
 * Route: GET /events/:eventId/chat
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
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] }
      ],
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
