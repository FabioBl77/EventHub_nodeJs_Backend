const express = require("express");
const router = express.Router();

const {
  createReport,
  getAllReports,
  resolveReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/*
=====================================================
                  SEGNALAZIONI
=====================================================
*/

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Gestione delle segnalazioni eventi
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Crea una nuova segnalazione per un evento
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Segnalazione creata con successo
 *       400:
 *         description: Dati mancanti
 */
router.post("/", authMiddleware, createReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Recupera tutte le segnalazioni (solo admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista segnalazioni restituita correttamente
 *       403:
 *         description: Accesso negato
 */
router.get("/", authMiddleware, roleMiddleware("admin"), getAllReports);

/**
 * @swagger
 * /api/reports/{id}/resolve:
 *   put:
 *     summary: Segna una segnalazione come risolta/non risolta
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stato segnalazione aggiornato
 *       404:
 *         description: Segnalazione non trovata
 */
router.put("/:id/resolve", authMiddleware, roleMiddleware("admin"), resolveReport);

module.exports = router;
