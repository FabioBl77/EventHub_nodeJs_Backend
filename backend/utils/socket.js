const Chat = require("../models/Chat");
const User = require("../models/User");

let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Nuovo client connesso:", socket.id);

    // Join stanza utente per notifiche private
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Join stanza evento per chat in tempo reale
    socket.on("join_event", (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`Socket ${socket.id} joined room event_${eventId}`);
    });

    // ==========================
    // CHAT EVENTO LIVE + PERSISTENTE
    // ==========================
    socket.on("send_message", async ({ eventId, message, userId, username }) => {
      try {
        // ✅ Recupera il nome utente se non passato
        let senderName = username;
        if (!senderName) {
          const user = await User.findByPk(userId, { attributes: ["username"] });
          senderName = user?.username || "Utente";
        }

            // ==========================
            // INDICATORE "STA SCRIVENDO..."
            // ==========================
            socket.on("typing", ({ eventId, username }) => {
              socket.to(`event_${eventId}`).emit("user_typing", { username });
            });


        // ✅ Salva nel database
        const savedMessage = await Chat.create({
          eventId,
          userId,
          content: message,
        });

        // ✅ Costruisci il messaggio completo da inviare
        const msg = {
          id: savedMessage.id,
          eventId,
          message,
          userId,
          username: senderName,
          timestamp: savedMessage.createdAt,
        };

        // ✅ Invia a tutti nella stanza evento
        io.to(`event_${eventId}`).emit("new_message", msg);
        console.log(`💬 [Chat] ${senderName} → evento ${eventId}`);
      } catch (err) {
        console.error("❌ Errore nel salvataggio del messaggio:", err);
      }
    });

    // ==========================
    // DISCONNESSIONE
    // ==========================
    socket.on("disconnect", () => {
      console.log("Client disconnesso:", socket.id);
    });
  });

  return io;
};

// Funzione per accedere all'istanza di Socket.IO da altri controller
const getIO = () => {
    if (!io) throw new Error("Socket.io non inizializzato!");
    return io;
};

module.exports = { initSocket, getIO };
