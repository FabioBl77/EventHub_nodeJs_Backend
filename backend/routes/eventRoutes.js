// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Operazioni sugli eventi
 */

/**
 * @swagger
 * /events/dashboard:
 *   get:
 *     summary: Dashboard personale (eventi creati e a cui si è iscritti)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard personale
 */
router.get('/dashboard', authMiddleware, eventController.personalDashboard);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Crea un nuovo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *             required:
 *               - title
 *               - date
 *               - location
 *               - capacity
 *     responses:
 *       201:
 *         description: Evento creato
 *       401:
 *         description: Token mancante o non valido
 */
router.post('/', authMiddleware, eventController.createEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     summary: Aggiorna un evento esistente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento aggiornato
 *       403:
 *         description: Non autorizzato
 *       404:
 *         description: Evento non trovato
 */
router.put('/:eventId', authMiddleware, eventController.updateEvent);

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     summary: Cancella un evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento cancellato
 *       403:
 *         description: Non autorizzato
 *       404:
 *         description: Evento non trovato
 */
router.delete('/:eventId', authMiddleware, eventController.deleteEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista eventi pubblici
 *     tags: [Events]
 *     parameters:
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista eventi
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /events/{eventId}/register:
 *   post:
 *     summary: Iscrizione a un evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Iscrizione avvenuta
 *       400:
 *         description: Utente già iscritto
 */
router.post('/:eventId/register', authMiddleware, eventController.registerToEvent);

/**
 * @swagger
 * /events/{eventId}/cancel:
 *   delete:
 *     summary: Annulla iscrizione a un evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Iscrizione annullata
 *       404:
 *         description: Iscrizione non trovata
 */
router.delete('/:eventId/cancel', authMiddleware, eventController.cancelRegistration);

/**
 * @swagger
 * /events/{eventId}/report:
 *   post:
 *     summary: Segnala un evento agli admin
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento segnalato agli admin
 *       404:
 *         description: Evento non trovato
 */
router.post('/:eventId/report', authMiddleware, eventController.reportEvent);

/**
 * @swagger
 * /events/filter:
 *   get:
 *     summary: Filtra eventi per data, categoria e luogo
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data dell'evento (es. 2025-10-10)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoria evento (es. "musica", "sport")
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Luogo dell'evento
 *     responses:
 *       200:
 *         description: Lista eventi filtrati
 */
router.get('/filter', eventController.filterEvents);


module.exports = router;
