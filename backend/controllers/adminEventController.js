const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

/* =====================================================
   LISTA COMPLETA EVENTI
===================================================== */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email", "role"]
        },
        {
          model: Registration,
          as: "registrations",
          attributes: ["id"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const formatted = events.map(ev => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      location: ev.location,
      category: ev.category,
      date: ev.date,
      capacity: ev.capacity,
      image: ev.image,
      isBlocked: ev.isBlocked,
      createdAt: ev.createdAt,
      creator: ev.creator,
      registrationCount: ev.registrations?.length || 0
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Errore getAllEvents:", err);
    res.status(500).json({ message: "Errore nel recupero eventi" });
  }
};

/* =====================================================
   GET EVENTO SINGOLO (ADMIN)
===================================================== */
const getAdminEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [{ model: User, as: "creator", attributes: ["id", "username"] }]
    });

    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Errore getAdminEventById:", err);
    res.status(500).json({ message: "Errore nel recupero evento" });
  }
};

/* =====================================================
   AGGIORNAMENTO EVENTO (ADMIN)
===================================================== */
const updateEventByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    await event.update(updates);

    res.status(200).json({
      message: "Evento aggiornato correttamente",
      event,
    });
  } catch (err) {
    console.error("Errore updateEventByAdmin:", err);
    res.status(500).json({ message: "Errore durante l'aggiornamento evento" });
  }
};

/* =====================================================
   BLOCCA / SBLOCCA EVENTO
===================================================== */
const blockEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const newStatus = !event.isBlocked;
    await event.update({ isBlocked: newStatus });

    res.status(200).json({
      message: newStatus
        ? "Evento bloccato correttamente"
        : "Evento sbloccato correttamente",
      isBlocked: newStatus,
    });
  } catch (err) {
    console.error("Errore blockEvent:", err);
    res.status(500).json({ message: "Errore nel blocco/sblocco evento" });
  }
};

/* =====================================================
   ELIMINA EVENTO (ADMIN)
===================================================== */
const deleteEventByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Registration.destroy({ where: { eventId: id } });

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    await event.destroy();

    res.status(200).json({ message: "Evento eliminato correttamente" });
  } catch (err) {
    console.error("Errore deleteEventByAdmin:", err);
    res.status(500).json({ message: "Errore nell'eliminazione evento" });
  }
};

module.exports = {
  getAllEvents,
  getAdminEventById,
  updateEventByAdmin,
  blockEvent,
  deleteEventByAdmin
};
