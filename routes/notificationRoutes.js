const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Operazioni relative alle notifiche
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Recupera le notifiche dell'utente loggato
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista notifiche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token mancante o non valido
 */
router.get('/', authMiddleware, notificationController.getNotifications);

module.exports = router;
