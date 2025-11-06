const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

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
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);

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

/**
 * @swagger
 * /users/role:
 *   put:
 *     summary: Aggiorna ruolo utente (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Ruolo aggiornato
 *       403:
 *         description: Accesso negato
 */
router.put('/role', authMiddleware, roleMiddleware('admin'), userController.updateRole);

/**
 * @swagger
 * /users/block:
 *   put:
 *     summary: Blocca o sblocca un utente (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               block:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Utente bloccato/sbloccato
 *       403:
 *         description: Accesso negato
 */
router.put('/block', authMiddleware, roleMiddleware('admin'), userController.blockUser);

module.exports = router;
