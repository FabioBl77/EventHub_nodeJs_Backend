const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operazioni utenti
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista utenti (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista utenti
 *       403:
 *         description: Accesso negato
 */
router.get('/', authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Dettaglio utente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utente trovato
 *       404:
 *         description: Utente non trovato
 */
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
