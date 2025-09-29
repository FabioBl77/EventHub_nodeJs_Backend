require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

// Config DB
const db = require('./config/db');

// Middleware
const errorMiddleware = require('./middlewares/errorMiddleware');

// Swagger
const setupSwagger = require('./docs/swagger');

// Rotte
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Socket.io
const { initSocket } = require('./utils/socket');

const app = express();
app.use(cors());
app.use(express.json());

// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Swagger docs
setupSwagger(app);

// Middleware globale errori
app.use(errorMiddleware);

// Creazione server HTTP
const server = http.createServer(app);

// Inizializzazione Socket.io
const io = initSocket(server);
app.set('io', io); // rende io accessibile nei controller con req.app.get('io')

// Connessione al database e avvio server
db.sync()
  .then(() => {
    console.log('Database connesso correttamente');
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Errore connessione al database:', err);
  });
