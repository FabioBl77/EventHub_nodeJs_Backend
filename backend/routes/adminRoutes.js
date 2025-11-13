const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserDetails,
  updateUserRole,
  toggleUserBlock,
  deleteUser
} = require("../controllers/admin/adminUserController");

const {
  getAllEvents,
  blockEvent,
  deleteEventByAdmin
} = require("../controllers/admin/adminEventController");

const { getAllReports } = require("../controllers/admin/adminReportController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Middleware globale per admin
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

/*
=====================================================
                  UTENTI
=====================================================
*/

/**
 * @swagger
 * tags:
 *   name: Admin - Utenti
 *   description: Endpoint per la gestione utenti lato amministrazione
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Restituisce la lista completa degli utenti
 *     tags: [Admin - Utenti]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista utenti restituita correttamente
 *       401:
 *         description: Utente non autenticato
 *       403:
 *         description: Accesso negato (non admin)
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Restituisce i dettagli di un utente
 *     tags: [Admin - Utenti]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell'utente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dettagli utente
 *       404:
 *         description: Utente non trovato
 */
router.get("/users/:id", getUserDetails);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Aggiorna il ruolo di un utente
 *     tags: [Admin - Utenti]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Ruolo aggiornato
 *       400:
 *         description: Ruolo non valido
 */
router.put("/users/:id/role", updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   put:
 *     summary: Blocca o sblocca un utente
 *     tags: [Admin - Utenti]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stato blocco aggiornato
 *       404:
 *         description: Utente non trovato
 */
router.put("/users/:id/block", toggleUserBlock);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Elimina definitivamente un utente
 *     tags: [Admin - Utenti]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utente eliminato
 *       404:
 *         description: Utente non trovato
 */
router.delete("/users/:id", deleteUser);


/*
=====================================================
                  EVENTI
=====================================================
*/

/**
 * @swagger
 * tags:
 *   name: Admin - Eventi
 *   description: Endpoint gestione eventi lato amministrazione
 */

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Restituisce la lista completa degli eventi
 *     tags: [Admin - Eventi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista eventi restituita correttamente
 */
router.get("/events", getAllEvents);

/**
 * @swagger
 * /api/admin/events/{id}/block:
 *   put:
 *     summary: Blocca o sblocca un evento
 *     tags: [Admin - Eventi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento bloccato o sbloccato
 *       404:
 *         description: Evento non trovato
 */
router.put("/events/:id/block", blockEvent);

/**
 * @swagger
 * /api/admin/events/{id}:
 *   delete:
 *     summary: Elimina un evento come amministratore
 *     tags: [Admin - Eventi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminato
 *       404:
 *         description: Evento non trovato
 */
router.delete("/events/:id", deleteEventByAdmin);


/*
=====================================================
                  SEGNALAZIONI
=====================================================
*/

/**
 * @swagger
 * tags:
 *   name: Admin - Segnalazioni
 *   description: Endpoint gestione segnalazioni eventi
 */

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Restituisce tutte le segnalazioni degli eventi
 *     tags: [Admin - Segnalazioni]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista segnalazioni
 */
router.get("/reports", getAllReports);

module.exports = router;
