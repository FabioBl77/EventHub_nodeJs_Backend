/**
 * Middleware per controllare il ruolo dell'utente
 * @param {string} role - ruolo richiesto ('admin', 'user', ecc.)
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

    // Permette sia stringa singola che array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    if (req.user.isBlocked) return res.status(403).json({ message: 'Utente bloccato' });

    next();
  };
};


module.exports = roleMiddleware;
