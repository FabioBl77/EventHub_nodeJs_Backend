const Report = require("../models/Report");
const Event = require("../models/Event");
const User = require("../models/User");
const { getIO } = require("../utils/socket");

/**
 * 🔹 Crea una nuova segnalazione
 * - un utente segnala un evento
 * - la segnalazione viene salvata
 * - viene notificato in tempo reale l'admin
 */
const createReport = async (req, res) => {
  try {
    const { eventId, reason } = req.body;
    const userId = req.user?.userId;

    console.log("🟢 Ricevuta richiesta di segnalazione:", { eventId, reason, userId });

    if (!eventId || !reason || !userId) {
      console.warn("❌ Dati mancanti nella richiesta:", { eventId, reason, userId });
      return res.status(400).json({ message: "Dati mancanti nella richiesta" });
    }

    // controlla se l’evento esiste
    const event = await Event.findByPk(eventId);
    if (!event) {
      console.warn("❌ Evento non trovato:", eventId);
      return res.status(404).json({ message: "Evento non trovato" });
    }

    // salva la segnalazione
    const report = await Report.create({
      reason,
      userId,
      eventId,
      isResolved: false,
    });

    console.log("✅ Segnalazione salvata nel DB:", report.toJSON());

    // recupera info utente per la notifica socket
    const user = await User.findByPk(userId, { attributes: ["username", "email"] });

    const io = getIO();
    io.emit("report_created", {
      id: report.id,
      reason,
      event: { id: event.id, title: event.title },
      user: { id: user.id, username: user.username },
      createdAt: report.createdAt,
    });

    return res.status(201).json({
      message: "Segnalazione inviata correttamente",
      report,
    });
  } catch (err) {
    console.error("❌ Errore creazione segnalazione:", err);
    res.status(500).json({ message: "Errore durante l'invio della segnalazione" });
  }
};

/**
 * 🔹 Recupera tutte le segnalazioni (solo admin)
 */
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
        { model: Event, as: "event", attributes: ["id", "title", "date"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Errore getAllReports:", err);
    res.status(500).json({ message: "Errore nel recupero delle segnalazioni" });
  }
};

/**
 * 🔹 Aggiorna stato segnalazione (risolta / non risolta)
 */
const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Segnalazione non trovata" });
    }

    report.isResolved = !report.isResolved;
    await report.save();

    res.status(200).json({
      message: `Segnalazione ${report.isResolved ? "risolta" : "riaperta"}`,
      report,
    });
  } catch (err) {
    console.error("Errore resolveReport:", err);
    res.status(500).json({ message: "Errore durante l'aggiornamento segnalazione" });
  }
};

module.exports = {
  createReport,
  getAllReports,
  resolveReport,
};
