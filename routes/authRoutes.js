const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../config/passport');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operazioni di autenticazione
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrazione utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente creato con successo, email di conferma inviata
 *       400:
 *         description: Email già registrata o input non valido
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *       400:
 *         description: Password errata
 *       403:
 *         description: Email non confermata
 *       404:
 *         description: Utente non trovato
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout utente
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout effettuato
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Richiesta reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Email inviata se l’utente esiste
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password usando token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token ricevuto via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nuova password
 *                 example: NuovaPassword123!
 *     responses:
 *       200:
 *         description: Password aggiornata con successo
 *       400:
 *         description: Token non valido o scaduto
 *       500:
 *         description: Errore interno
 */
router.post('/reset-password/:token', authController.resetPassword);

/**
 * 🔹 Nuove rotte OAuth Google
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login rapido con Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Reindirizzamento a Google per login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Reindirizzamento al frontend con token JWT
 */
// authRoutes.js – callback Google OAuth aggiornata
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    try {
      if (!req.user) {
        // Caso raro: Passport non ha autenticato
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      const { generateToken } = require('../config/jwt');
      const token = generateToken({ userId: req.user.id, role: req.user.role });

      // Reindirizzamento al frontend con token
      res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    } catch (err) {
      console.error('Errore callback OAuth Google:', err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server`);
    }
  }
);


module.exports = router;
