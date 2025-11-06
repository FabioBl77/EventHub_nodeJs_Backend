/**
 * Middleware globale per gestione errori
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorMiddleware;
