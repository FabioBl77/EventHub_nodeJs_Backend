// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Invia una notifica a un utente o a tutti gli admin
 * @param {Object} param0
 * @param {number} param0.userId - ID dell'utente destinatario
 * @param {string} param0.content - Testo della notifica
 * @param {boolean} param0.broadcastToAdmins - Se true invia a tutti gli admin
 * @param {Object} req - Oggetto request (per accedere a Socket.io)
 */
const sendNotification = async ({ userId, content, broadcastToAdmins = false }, req) => {
  try {
    if (broadcastToAdmins) {
      // Trova tutti gli admin
      const admins = await User.findAll({ where: { role: 'admin' }, attributes: ['id'] });
      for (const admin of admins) {
        // Salva nel DB
        const notification = await Notification.create({
          userId: admin.id,
          content,
          read: false
        });
        // Invia live tramite socket.io
        req.app.get('io')?.to(`user_${admin.id}`).emit('notification', notification);
      }
    } else {
      // Salva notifica nel DB
      const notification = await Notification.create({ userId, content, read: false });
      // Invia live tramite socket.io
      req.app.get('io')?.to(`user_${userId}`).emit('notification', notification);
    }
  } catch (err) {
    console.error('Errore sendNotification:', err);
  }
};

/**
 * Recupera tutte le notifiche di un utente
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ notifications });
  } catch (err) {
    console.error('Errore getNotifications:', err);
    res.status(500).json({ message: 'Errore recupero notifiche' });
  }
};

/**
 * Segna una notifica come letta
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification || notification.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Notifica non trovata' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notifica letta', notification });
  } catch (err) {
    console.error('Errore markAsRead:', err);
    res.status(500).json({ message: 'Errore aggiornamento notifica' });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead
};
