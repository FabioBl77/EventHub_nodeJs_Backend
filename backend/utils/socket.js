let io;

const initSocket = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Nuovo client connesso:', socket.id);

    // Join stanza utente per notifiche private
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Join stanza evento per chat in tempo reale
    socket.on('join_event', (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`Socket ${socket.id} joined room event_${eventId}`);
    });

    // Ricezione messaggio in tempo reale (dal client)
    socket.on('send_message', ({ eventId, message, userId }) => {
      // Emesso a tutti i partecipanti dell'evento
      io.to(`event_${eventId}`).emit('new_message', {
        eventId,
        message,
        userId,
        timestamp: new Date()
      });
      console.log(`Messaggio inviato all'evento ${eventId} da utente ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnesso:', socket.id);
    });
  });

  return io;
};

// Funzione per accedere all'istanza di Socket.IO da altri controller
const getIO = () => {
  if (!io) throw new Error('Socket.io non inizializzato!');
  return io;
};

module.exports = { initSocket, getIO };
