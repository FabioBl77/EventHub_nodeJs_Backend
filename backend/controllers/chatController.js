const Chat = require("../models/Chat");
const Event = require("../models/Event");
const User = require("../models/User");

/**
 * 📩 Invia un messaggio (salva nel DB e notifica in real-time)
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
      return res.status(404).json({ message: "Evento non trovato" });
    }

    // Crea e salva messaggio nel DB
    const message = await Chat.create({
      content,
      eventId,
      userId: req.user.userId,
    });

    // Recupera utente
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "username"],
    });

    // Prepara il messaggio da inviare
    const msgData = {
      id: message.id,
      eventId,
      message: message.content,
      userId: message.userId,
      username: user?.username || `utente#${message.userId}`,
      timestamp: message.createdAt,
    };

    // Emetti evento realtime
    const io = req.app.get("io");
    if (io) io.to(`event_${eventId}`).emit("new_message", msgData);

    res.status(201).json({
      message: "Messaggio inviato",
      chat: msgData,
    });
  } catch (err) {
    console.error("❌ Errore invio messaggio:", err);
    res
      .status(500)
      .json({ message: "Errore durante l'invio del messaggio" });
  }
};

/**
 * 📜 Recupera la cronologia della chat per un evento
 * Route: GET /events/:eventId/chat
 */
const getMessagesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Controllo evento esistente
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    // Recupera messaggi con username ordinati per data
    const messages = await Chat.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const formatted = messages.map((msg) => ({
      id: msg.id,
      eventId: msg.eventId,
      message: msg.content,
      userId: msg.userId,
      username: msg.user?.username || `utente#${msg.userId}`,
      timestamp: msg.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Errore recupero messaggi:", err);
    res
      .status(500)
      .json({ message: "Errore durante il recupero dei messaggi" });
  }
};

module.exports = {
  sendMessage,
  getMessagesByEvent,
};
