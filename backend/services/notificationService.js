/**
 * Notifica iscrizione/cancellazione evento
 * @param {Object} io - istanza Socket.io
 * @param {Number} eventId - ID evento
 * @param {String} type - 'register' o 'cancel'
 * @param {Object} user - utente che ha effettuato l'azione
 */
const notifyEventChange = (io, eventId, type, user) => {
  io.to(`event_${eventId}`).emit('eventUpdate', {
    type,
    user: { id: user.id, username: user.username },
    eventId
  });
};

/**
 * Notifica admin di segnalazioni evento
 * @param {Object} io - istanza Socket.io
 * @param {Object} report - dati segnalazione
 */
const notifyAdmin = (io, report) => {
  io.to('admin_room').emit('reportNotification', report);
};

/**
 * Recupera notifiche per utente (opzionale, persistenti)
 * In questa versione base, non persistiamo nel DB
 */
const getNotifications = async (userId) => {
  // Placeholder per future implementazioni con DB
  return [];
};

module.exports = {
  notifyEventChange,
  notifyAdmin,
  getNotifications
};
