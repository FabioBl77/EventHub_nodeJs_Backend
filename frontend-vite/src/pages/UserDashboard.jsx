import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import EventCard from "../components/EventCard";
import "../styles/UserDashboard.css";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [publicEvents, setPublicEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", category: "", location: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔽 Stati visibilità sezioni (inizializzati da localStorage)
  const [showAvailable, setShowAvailable] = useState(() => {
    const saved = localStorage.getItem("showAvailable");
    return saved === null ? true : JSON.parse(saved);
  });
  const [showCreated, setShowCreated] = useState(() => {
    const saved = localStorage.getItem("showCreated");
    return saved === null ? true : JSON.parse(saved);
  });
  const [showRegistered, setShowRegistered] = useState(() => {
    const saved = localStorage.getItem("showRegistered");
    return saved === null ? true : JSON.parse(saved);
  });

  // 📌 Salva automaticamente quando cambia una sezione
  useEffect(() => {
    localStorage.setItem("showAvailable", JSON.stringify(showAvailable));
  }, [showAvailable]);

  useEffect(() => {
    localStorage.setItem("showCreated", JSON.stringify(showCreated));
  }, [showCreated]);

  useEffect(() => {
    localStorage.setItem("showRegistered", JSON.stringify(showRegistered));
  }, [showRegistered]);

  // 📌 Carica tutti gli eventi e la dashboard personale
  const fetchEvents = async () => {
    try {
      setError("");
      setLoading(true);

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
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("Errore nel caricamento degli eventi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Gestione filtri locali
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 🔎 Filtraggio frontend
  const applyFilters = (events) =>
    events.filter((event) => {
      const matchesDate =
        !filters.date ||
        (event.date &&
          new Date(event.date).toDateString() ===
            new Date(filters.date).toDateString());
      const matchesCategory =
        !filters.category ||
        (event.category || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase());
      const matchesLocation =
        !filters.location ||
        (event.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      return matchesDate && matchesCategory && matchesLocation;
    });

  const filteredPublicEvents = applyFilters(publicEvents);
  const filteredCreatedEvents = applyFilters(createdEvents);
  const filteredRegisteredEvents = applyFilters(registeredEvents);

  // 🔹 Verifica iscrizione
  const isEventRegistered = (eventId) =>
    registeredEvents.some((e) => e.id === eventId);

  // 🔹 Aggiorna UI dopo iscrizione / disiscrizione
  const handleToggleRegistration = (eventId, nowRegistered) => {
    const allEvents = [...publicEvents, ...createdEvents, ...registeredEvents];
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) return;

    if (nowRegistered) {
      if (!registeredEvents.some((e) => e.id === eventId)) {
        setRegisteredEvents((prev) => [...prev, event]);
      }
      setPublicEvents((prev) => prev.filter((e) => e.id !== eventId));
    } else {
      setRegisteredEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (!publicEvents.some((e) => e.id === eventId)) {
        setPublicEvents((prev) => [...prev, event]);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-title">
          Benvenuto nella tua Dashboard
          {user?.username ? `, ${user.username}!` : "!"}
        </h1>
        <p>Caricamento eventi...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* 🔹 Titolo con nome utente */}
      <h1 className="dashboard-title">
        Benvenuto nella tua Dashboard
        {user?.username ? `, ${user.username}!` : "!"}
      </h1>

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

      {/* 🔹 Eventi disponibili */}
      <section className="dashboard-section">
        <div
          className="section-header"
          onClick={() => setShowAvailable((p) => !p)}
        >
          <h2>Eventi disponibili</h2>
          <span className="toggle-icon">{showAvailable ? "▲" : "▼"}</span>
        </div>
        {showAvailable && (
          <div className="events-grid fade-in">
            {filteredPublicEvents.length > 0 ? (
              filteredPublicEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isEventRegistered(event.id)}
                  onToggleRegistration={handleToggleRegistration}
                />
              ))
            ) : (
              <p>Nessun evento disponibile.</p>
            )}
          </div>
        )}
      </section>

      {/* 🔹 Eventi creati da te */}
      <section className="dashboard-section">
        <div
          className="section-header"
          onClick={() => setShowCreated((p) => !p)}
        >
          <h2>I miei eventi creati</h2>
          <span className="toggle-icon">{showCreated ? "▲" : "▼"}</span>
        </div>
        {showCreated && (
          <div className="events-grid fade-in">
            {filteredCreatedEvents.length > 0 ? (
              filteredCreatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isEventRegistered(event.id)}
                  onToggleRegistration={handleToggleRegistration}
                />
              ))
            ) : (
              <p>Non hai ancora creato eventi.</p>
            )}
          </div>
        )}
      </section>

      {/* 🔹 Eventi a cui sei iscritto */}
      <section className="dashboard-section">
        <div
          className="section-header"
          onClick={() => setShowRegistered((p) => !p)}
        >
          <h2>Eventi a cui sei iscritto</h2>
          <span className="toggle-icon">{showRegistered ? "▲" : "▼"}</span>
        </div>
        {showRegistered && (
          <div className="events-grid fade-in">
            {filteredRegisteredEvents.length > 0 ? (
              filteredRegisteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={true}
                  onToggleRegistration={handleToggleRegistration}
                />
              ))
            ) : (
              <p>Non sei ancora iscritto ad alcun evento.</p>
            )}
          </div>
        )}
      </section>

      {/* 🔹 Pulsante Crea Evento */}
      <button
        onClick={() => navigate("/create-event")}
        className="btn-create"
      >
        ➕ Crea nuovo evento
      </button>
    </div>
  );
}
