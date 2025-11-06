const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Operazioni chat per eventi
 */

/**
 * @swagger
 * /chats/{eventId}:
 *   post:
 *     summary: Invia un messaggio in chat per un evento
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dell'evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Messaggio da inviare
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Messaggio inviato
 *       400:
 *         description: Errore input
 *       401:
 *         description: Token mancante o non valido
 *       404:
 *         description: Evento non trovato
 */
router.post('/:eventId', authMiddleware, chatController.sendMessage);

/**
 * @swagger
 * /chats/{eventId}:
 *   get:
 *     summary: Leggi tutti i messaggi della chat di un evento
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dell'evento
 *     responses:
 *       200:
 *         description: Lista messaggi
 *       401:
 *         description: Token mancante o non valido
 *       404:
 *         description: Evento non trovato
 */
router.get('/:eventId', authMiddleware, chatController.getMessagesByEvent);

module.exports = router;
