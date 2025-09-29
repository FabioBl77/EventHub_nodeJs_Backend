/**
 * Middleware per controllare il ruolo dell'utente
 * @param {string} role - ruolo richiesto ('admin', 'user', ecc.)
 */
const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    next();
  };
};

module.exports = roleMiddleware;
