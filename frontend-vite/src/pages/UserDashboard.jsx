import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import EventCard from "../components/EventCard";
import Filters from "../components/Filters";
import "../styles/UserDashboard.css";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [publicEvents, setPublicEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    date: "",
    category: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Stato visibilità sezioni
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

  // 🔹 Salva stato visibilità
  useEffect(() => {
    localStorage.setItem("showAvailable", JSON.stringify(showAvailable));
  }, [showAvailable]);
  useEffect(() => {
    localStorage.setItem("showCreated", JSON.stringify(showCreated));
  }, [showCreated]);
  useEffect(() => {
    localStorage.setItem("showRegistered", JSON.stringify(showRegistered));
  }, [showRegistered]);

  // 🔹 Fetch eventi
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

  // 🔍 Filtri
  const applyFilters = (events) =>
    events.filter((event) => {
      const matchTitle =
        !filters.title ||
        (event.title || "")
          .toLowerCase()
          .includes(filters.title.toLowerCase());
      const matchDate =
        !filters.date ||
        (event.date &&
          new Date(event.date).toDateString() ===
            new Date(filters.date).toDateString());
      const matchCategory =
        !filters.category ||
        (event.category || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase());
      const matchLocation =
        !filters.location ||
        (event.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      return matchTitle && matchDate && matchCategory && matchLocation;
    });

  const filteredPublicEvents = applyFilters(publicEvents);
  const filteredCreatedEvents = applyFilters(createdEvents);
  const filteredRegisteredEvents = applyFilters(registeredEvents);

  // 🔹 Verifica iscrizione
  const isEventRegistered = (eventId) =>
    registeredEvents.some((e) => e.id === eventId);

  // 🔹 Aggiorna liste dopo iscrizione/disiscrizione
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

  // 🔹 Loading
  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-title">
          Benvenuto nella tua Dashboard {user?.username ? `${user.username}!` : "!"}
        </h1>
        <p>Caricamento eventi...</p>
      </div>
    );
  }

  // 🔹 Render
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">
        Benvenuto nella tua Dashboard {user?.username ? `${user.username}!` : "!"}
      </h1>

      {error && <p className="error">{error}</p>}

      {/* 🔹 Filtri */}
      <Filters filters={filters} setFilters={setFilters} />

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

      {/* 🔹 Eventi creati */}
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

      {/* 🔹 Eventi iscritti */}
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

      {/* 🔹 Pulsante crea evento */}
      <button onClick={() => navigate("/create-event")} className="btn-create">
        ➕ Crea nuovo evento
      </button>
    </div>
  );
}
