const Chat = require("../models/Chat");
const User = require("../models/User");

let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Nuovo client connesso:", socket.id);

    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("join_event", (eventId) => {
      socket.join(`event_${eventId}`);
    });

    socket.on("typing", ({ eventId, username }) => {
      socket.to(`event_${eventId}`).emit("user_typing", { username });
    });

    socket.on("send_message", async ({ eventId, message, userId, username }) => {
      try {
        let senderName = username;
        if (!senderName) {
          const user = await User.findByPk(userId, { attributes: ["username"] });
          senderName = user?.username || "Utente";
        }

        const savedMessage = await Chat.create({
          eventId,
          userId,
          content: message
        });

        const msg = {
          id: savedMessage.id,
          eventId,
          message,
          userId,
          username: senderName,
          timestamp: savedMessage.createdAt
        };

        io.to(`event_${eventId}`).emit("new_message", msg);
      } catch (err) {
        console.error("Errore nel salvataggio del messaggio:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnesso:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io non inizializzato");
  return io;
};

module.exports = { initSocket, getIO };
