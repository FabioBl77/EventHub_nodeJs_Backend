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
  const [loading, setLoading] = useState(true);

  // 📌 Carica tutti gli eventi e la dashboard personale
  const fetchEvents = async () => {
    try {
      setError("");
      setLoading(true);

      // Chiamate ai tuoi endpoint backend
      const [publicRes, dashboardRes] = await Promise.all([
        api.get("/events"),
        api.get("/events/dashboard"),
      ]);

      setPublicEvents(publicRes.data || []);
      setCreatedEvents(dashboardRes.data.createdEvents || []);
      setRegisteredEvents(dashboardRes.data.joinedEvents || []);
    } catch (err) {
      console.error("❌ Errore nel caricamento della dashboard:", err);
      if (err.response?.status === 401) {
        setError("Devi effettuare il login per accedere alla dashboard.");
      } else {
        setError("Errore nel caricamento degli eventi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔍 Gestione filtri locali
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 🔎 Funzione di filtraggio frontend
  const applyFilters = (events) => {
    return events.filter((event) => {
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
  };

  // 🔎 Applica filtri a tutte le sezioni
  const filteredPublicEvents = applyFilters(publicEvents);
  const filteredCreatedEvents = applyFilters(createdEvents);
  const filteredRegisteredEvents = applyFilters(registeredEvents);

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

      {loading ? (
        <p>Caricamento eventi...</p>
      ) : (
        <>
          {/* 🔹 Eventi pubblici */}
          <section>
            <h2>Eventi disponibili</h2>
            <div className="events-grid">
              {filteredPublicEvents.length > 0 ? (
                filteredPublicEvents.map((event) => (
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
              {filteredCreatedEvents.length > 0 ? (
                filteredCreatedEvents.map((event) => (
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
              {filteredRegisteredEvents.length > 0 ? (
                filteredRegisteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onAction={fetchEvents}
                    isRegisteredSection={true} // 👈 cambia bottone in "Annulla iscrizione"
                  />
                ))
              ) : (
                <p>Non sei ancora iscritto ad alcun evento.</p>
              )}
            </div>
          </section>
        </>
      )}

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
