// src/pages/AdminEvents.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // 🔎 FILTRI
  const [filters, setFilters] = useState({
    title: "",
    date: "",
    category: "",
    location: "",
  });

  // Carica eventi
  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminEvents();
      setEvents(res.data);
    } catch (e) {
      console.error("Errore caricamento eventi:", e);
      toast.error("Errore nel caricamento degli eventi", { position: "top-center" });
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
      const updated = await blockEventByAdmin(id);

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === updated.id ? { ...ev, isBlocked: updated.isBlocked } : ev
        )
      );

      toast.info(updated.isBlocked ? "Evento bloccato" : "Evento sbloccato", {
        position: "top-center",
      });
    } catch (e) {
      console.error("Errore blocco/sblocco evento:", e);
      toast.error("Errore nel blocco/sblocco evento", { position: "top-center" });
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
      toast.error("Errore nell'eliminazione evento", { position: "top-center" });
    }
  };

  // 🔍 FILTRI APPLICATI
  const filteredEvents = events.filter((event) => {
    const matchTitle =
      !filters.title ||
      event.title.toLowerCase().includes(filters.title.toLowerCase());

    const matchCategory =
      !filters.category ||
      event.category?.toLowerCase().includes(filters.category.toLowerCase());

    const matchLocation =
      !filters.location ||
      event.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchDate =
      !filters.date ||
      (event.date && event.date.startsWith(filters.date));

    return matchTitle && matchCategory && matchLocation && matchDate;
  });

  return (
    <div className="admin-events-page">
      
      {/* 🌟 TITOLO MIGLIORATO */}
      <h1 className="admin-events-title">
        Pannello Gestione Eventi
      </h1>

      {/* 🔎 FILTRI */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Cerca per titolo..."
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoria"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Luogo"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />
      </div>

      {loading ? (
        <p>Caricamento eventi...</p>
      ) : filteredEvents.length === 0 ? (
        <p>Nessun evento corrisponde ai filtri.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`event-card ${event.isBlocked ? "blocked" : ""}`}
            >
              <div className="event-image">
                <img src={event.image || "/placeholder-event.jpg"} alt={event.title} />
              </div>

              <div className="event-info">
                <h3>{event.title}</h3>

                <p>
                  <strong>Creato da:</strong> {event.creator?.username || "Sconosciuto"}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString("it-IT")
                    : "N/D"}
                </p>

                <span
                  className={`status-badge ${event.isBlocked ? "red" : "green"}`}
                >
                  {event.isBlocked ? "Bloccato" : "Attivo"}
                </span>

                <div className="event-actions">
                  <button className="btn-action" onClick={() => handleBlock(event.id)}>
                    {event.isBlocked ? "Sblocca" : "Blocca"}
                  </button>

                  <button className="btn-delete" onClick={() => handleDelete(event.id)}>
                    Elimina
                  </button>

                  <button
                    className="btn-chat"
                    onClick={() => navigate(`/admin/event-chat/${event.id}`)}
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
