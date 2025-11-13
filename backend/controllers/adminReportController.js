const Report = require("../../models/Report");
const User = require("../../models/User");
const Event = require("../../models/Event");

// Restituisce tutte le segnalazioni
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      attributes: ["id", "reason", "createdAt"],
      include: [
        {
          model: User,
          as: "reporter", // alias corretto
          attributes: ["id", "username", "email", "role"]
        },
        {
          model: Event,
          as: "reportedEvent", // alias corretto
          attributes: [
            "id",
            "title",
            "description",
            "category",
            "location",
            "date",
            "isBlocked"
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const formattedReports = reports.map(report => ({
      id: report.id,
      reason: report.reason,
      createdAt: report.createdAt,
      user: report.reporter || null,
      event: report.reportedEvent || null
    }));

    res.status(200).json({
      count: formattedReports.length,
      reports: formattedReports
    });

  } catch (err) {
    console.error("Errore getAllReports:", err);
    res.status(500).json({ message: "Errore nel recupero segnalazioni" });
  }
};

module.exports = {
  getAllReports
};
