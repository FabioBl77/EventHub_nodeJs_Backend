import { useState, useEffect } from "react";
import api from "../api/api";
import EventCard from "../components/EventCard";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", category: "", location: "" });
  const [error, setError] = useState("");

  // 📌 Carica eventi
  const fetchEvents = async () => {
    try {
      setError("");

      // 1️⃣ Tutti gli eventi pubblici
      const publicRes = await api.get("/events");
      setPublicEvents(publicRes.data || []);

      // 2️⃣ Dashboard personale (eventi creati + iscrizioni)
      const personalRes = await api.get("/events/dashboard");
      setCreatedEvents(personalRes.data.createdEvents || []);
      setRegisteredEvents(personalRes.data.joinedEvents || []);
    } catch (err) {
      console.error("❌ Errore nel caricamento della dashboard:", err);
      if (err.response?.status === 401) {
        setError("Devi effettuare il login per accedere alla dashboard.");
      } else {
        setError("Errore nel caricamento degli eventi.");
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔍 Gestione filtri locali
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEvents = publicEvents.filter((event) => {
    const matchesDate =
      !filters.date ||
      new Date(event.date).toDateString() === new Date(filters.date).toDateString();
    const matchesCategory =
      !filters.category ||
      event.category?.toLowerCase().includes(filters.category.toLowerCase());
    const matchesLocation =
      !filters.location ||
      event.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesDate && matchesCategory && matchesLocation;
  });

  return (
    <div className="dashboard-page">
      <h1>Benvenuto nella tua Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {/* 🔹 Sezione Filtri */}
      <div className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Luogo"
          value={filters.location}
          onChange={handleFilterChange}
        />
      </div>

      {/* 🔹 Eventi pubblici */}
      <section>
        <h2>Eventi disponibili</h2>
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onAction={fetchEvents} />
            ))
          ) : (
            <p>Nessun evento disponibile.</p>
          )}
        </div>
      </section>

      {/* 🔹 Eventi creati da te */}
      <section>
        <h2>I miei eventi creati</h2>
        <div className="events-grid">
          {createdEvents.length > 0 ? (
            createdEvents.map((event) => (
              <EventCard key={event.id} event={event} onAction={fetchEvents} />
            ))
          ) : (
            <p>Non hai ancora creato eventi.</p>
          )}
        </div>
      </section>

      {/* 🔹 Eventi a cui sei iscritto */}
      <section>
        <h2>Eventi a cui sei iscritto</h2>
        <div className="events-grid">
          {registeredEvents.length > 0 ? (
            registeredEvents.map((event) => (
              <EventCard key={event.id} event={event} onAction={fetchEvents} />
            ))
          ) : (
            <p>Non sei ancora iscritto ad alcun evento.</p>
          )}
        </div>
      </section>

      {/* 🔹 Pulsante Crea Evento */}
      <button
        onClick={() => (window.location.href = "/create-event")}
        className="btn-create"
      >
        ➕ Crea nuovo evento
      </button>
    </div>
  );
}
