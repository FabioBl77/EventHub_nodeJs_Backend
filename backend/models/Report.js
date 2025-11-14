const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Modello invariato
const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

// ============================
//   🔹 RELAZIONI (aggiunte)
// ============================

try {
  const User = require("./User");
  const Event = require("./Event");

  // Utente che ha inviato la segnalazione
  Report.belongsTo(User, {
    foreignKey: "userId",
    as: "reporter", // ✅ alias unico
    onDelete: "CASCADE",
  });

  // Evento segnalato
  Report.belongsTo(Event, {
    foreignKey: "eventId",
    as: "reportedEvent", // ✅ alias cambiato
    onDelete: "CASCADE",
  });
} catch (err) {
  console.warn("⚠️ Relazioni Report non inizializzate:", err.message);
}


module.exports = Report;
