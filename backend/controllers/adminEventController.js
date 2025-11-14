const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

// Restituisce tutti gli eventi
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: [
      "id",
      "title",
      "description",
      "location",
      "category",
      "date",
      "capacity",
      "image",     
      "isBlocked",
      "createdAt"
    ],

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

    const formatted = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    category: event.category,
    date: event.date,
    capacity: event.capacity,
    image: event.image,                
    isBlocked: event.isBlocked,
    createdAt: event.createdAt,
    creator: event.creator,
    registrationCount: event.registrations ? event.registrations.length : 0
    }));


    res.status(200).json(formatted);
  } catch (err) {
    console.error("Errore getAllEvents:", err);
    res.status(500).json({ message: "Errore nel recupero eventi" });
  }
};

// Blocca o sblocca un evento
const blockEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    event.isBlocked = !event.isBlocked;
    await event.save();

    res.status(200).json({
      message: event.isBlocked
        ? "Evento bloccato correttamente"
        : "Evento sbloccato correttamente"
    });
  } catch (err) {
    console.error("Errore blockEvent:", err);
    res.status(500).json({ message: "Errore nel blocco evento" });
  }
};

// Eliminazione evento da parte dell'admin
const deleteEventByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    await Registration.destroy({
      where: { eventId: id }
    });

    await event.destroy();

    res.status(200).json({ message: "Evento eliminato correttamente" });
  } catch (err) {
    console.error("Errore deleteEventByAdmin:", err);
    res.status(500).json({ message: "Errore nell'eliminazione evento" });
  }
};

module.exports = {
  getAllEvents,
  blockEvent,
  deleteEventByAdmin
};
