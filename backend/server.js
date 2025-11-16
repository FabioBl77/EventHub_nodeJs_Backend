require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const adminRoutes = require('./routes/adminRoutes');

const { sequelize } = require('./models');

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
const reportRoutes = require("./routes/reportRoutes");

// Socket.io
const { initSocket } = require('./utils/socket');

// Passport
require('./config/passport');

const app = express();

/* =========================================
   CORS multi-ambiente (locale + produzione)
========================================= */
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,      // dominio del frontend su Render
      "http://localhost:5173"        // sviluppo locale
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =========================================
   Sessione (necessaria per Passport)
========================================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session_secret_eventhub',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* =========================================
   Rotte API
========================================= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reports", reportRoutes);

// Swagger
setupSwagger(app);

// Errori globali
app.use(errorMiddleware);

/* =========================================
   Server + Socket.io
========================================= */
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

/* =========================================
   Avvio server
========================================= */
const isProd = process.env.NODE_ENV === "production";

sequelize
  .sync(isProd ? {} : { alter: true })
  .then(() => {
    console.log("Database connesso e sincronizzato correttamente");
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server avviato sulla porta ${PORT}`);
    });
  })

  .catch((err) => {
    console.error('Errore connessione al database:', err);
  });
