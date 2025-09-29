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

    // Lato client può inviare evento join per unirsi a una "room" personale
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnesso:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io non inizializzato!');
  return io;
};

module.exports = { initSocket, getIO };
