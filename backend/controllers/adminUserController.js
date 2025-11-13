const User = require("../../models/User");
const Event = require("../../models/Event");
const Registration = require("../../models/Registration");
const { Op } = require("sequelize");

// Lista utenti completa
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "isBlocked", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(users);
  } catch (err) {
    console.error("Errore getAllUsers:", err);
    res.status(500).json({ message: "Errore nel recupero utenti" });
  }
};

// Dettagli utente
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "role", "isBlocked", "createdAt"],
      include: [
        {
          model: Event,
          as: "createdEvents",
          attributes: ["id", "title", "date", "isBlocked"],
        },
        {
          model: Registration,
          as: "registrations",
          include: [
            {
              model: Event,
              attributes: ["id", "title", "date"],
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Errore getUserDetails:", err);
    res.status(500).json({ message: "Errore nel recupero dettagli utente" });
  }
};

// Cambia ruolo utente
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const requesterId = req.user.userId;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Ruolo non valido" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    // Vietato cambiare il proprio ruolo
    if (requesterId === user.id) {
      return res.status(403).json({ message: "Non puoi modificare il tuo ruolo" });
    }

    // Se si sta retrocedendo un admin, controlliamo se è l'ultimo admin rimasto
    if (user.role === "admin" && role === "user") {
      const adminCount = await User.count({ where: { role: "admin" } });

      if (adminCount <= 1) {
        return res.status(400).json({ message: "Non puoi rimuovere l'ultimo amministratore" });
      }
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Ruolo aggiornato correttamente" });
  } catch (err) {
    console.error("Errore updateUserRole:", err);
    res.status(500).json({ message: "Errore aggiornamento ruolo" });
  }
};

// Blocca / sblocca utente
const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.userId;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    // Vietato bloccare sé stessi
    if (requesterId === user.id) {
      return res.status(403).json({ message: "Non puoi bloccare il tuo stesso account" });
    }

    // Vietato bloccare l'ultimo admin
    if (user.role === "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });

      if (adminCount <= 1) {
        return res.status(400).json({ message: "Non puoi bloccare l'ultimo amministratore" });
      }
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked
        ? "Utente bloccato correttamente"
        : "Utente sbloccato correttamente"
    });
  } catch (err) {
    console.error("Errore toggleUserBlock:", err);
    res.status(500).json({ message: "Errore aggiornamento stato utente" });
  }
};

// Elimina utente
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.userId;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    // Vietato eliminare sé stessi
    if (requesterId === user.id) {
      return res
        .status(403)
        .json({ message: "Non puoi eliminare il tuo stesso account" });
    }

    // Vietato eliminare l'ultimo admin
    if (user.role === "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Non puoi eliminare l'ultimo amministratore" });
      }
    }

    await user.destroy();

    res.status(200).json({ message: "Utente eliminato correttamente" });
  } catch (err) {
    console.error("Errore deleteUser:", err);
    res.status(500).json({ message: "Errore eliminazione utente" });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserRole,
  toggleUserBlock,
  deleteUser
};
