// src/pages/AdminEvents.jsx
import React, { useEffect, useState } from "react";
import {
  fetchAdminEvents,
  blockEventByAdmin,
  deleteEventByAdmin,
} from "../api/admin";
import { toast } from "react-toastify";
import "../styles/AdminEvents.css";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica tutti gli eventi dall'API admin
  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminEvents();
      setEvents(res.data); // l'API /admin/events restituisce direttamente l'array
    } catch (e) {
      console.error("Errore caricamento eventi:", e);
      toast.error("Errore nel caricamento degli eventi", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Blocca / sblocca evento
  const handleBlock = async (id) => {
    try {
      await blockEventByAdmin(id);
      toast.info("Stato evento aggiornato", { position: "top-center" });
      loadEvents();
    } catch (e) {
      console.error("Errore blocco/sblocco evento:", e);
      toast.error("Errore nel blocco/sblocco evento", {
        position: "top-center",
      });
    }
  };

  // Elimina evento
  const handleDelete = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questo evento?")) return;

    try {
      await deleteEventByAdmin(id);
      toast.success("Evento eliminato", { position: "top-center" });
      loadEvents();
    } catch (e) {
      console.error("Errore eliminazione evento:", e);
      toast.error("Errore nell'eliminazione evento", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="admin-events-page">
      <h1 className="admin-events-title">Gestione Eventi</h1>

      {loading ? (
        <p>Caricamento eventi...</p>
      ) : events.length === 0 ? (
        <p>Non ci sono eventi al momento.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className={`event-card ${event.isBlocked ? "blocked" : ""}`}
            >
              {/* Miniatura immagine */}
              <div className="event-image">
                <img
                  src={event.image || "/placeholder-event.jpg"}
                  alt={event.title}
                />
              </div>

              <div className="event-info">
                <h3>{event.title}</h3>
                <p>
                  <strong>Creato da:</strong>{" "}
                  {event.creator?.username || "Sconosciuto"}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString("it-IT")
                    : "N/D"}
                </p>

                <span
                  className={`status-badge ${
                    event.isBlocked ? "red" : "green"
                  }`}
                >
                  {event.isBlocked ? "Bloccato" : "Attivo"}
                </span>

                <div className="event-actions">
                  <button
                    className="btn-action"
                    onClick={() => handleBlock(event.id)}
                  >
                    {event.isBlocked ? "Sblocca" : "Blocca"}
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(event.id)}
                  >
                    Elimina
                  </button>

                  <button
                    className="btn-chat"
                    onClick={() =>
                      alert("Da collegare alla chat live dell’evento.")
                    }
                  >
                    Apri Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
