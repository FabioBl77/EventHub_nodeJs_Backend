require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const adminRoutes = require('./routes/adminRoutes');


// 🔹 Import modelli e connessione Sequelize
const { sequelize, User, Event, Registration } = require('./models');

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

// Passport: strategia Google
require('./config/passport');

const app = express();

// 🔹 CORS (frontend Vite)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// 🔹 Sessione (necessaria per Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session_secret_eventhub',
    resave: false,
    saveUninitialized: true,
  })
);

// 🔹 Inizializzazione Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use("/uploads", express.static("uploads"));



// 🔹 Swagger docs
setupSwagger(app);

// 🔹 Middleware globale errori
app.use(errorMiddleware);

// 🔹 Creazione server HTTP + Socket.io
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

// ✅ Import esplicito dei modelli per garantire inizializzazione completa
// User.sync();
// Event.sync();
// Registration.sync();

// 🔹 Connessione DB e avvio server
sequelize
  .sync({ alter: true }) // aggiorna le tabelle senza distruggere dati
  .then(() => {
    console.log('✅ Database connesso e sincronizzato correttamente');
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Errore connessione al database:', err);
  });
