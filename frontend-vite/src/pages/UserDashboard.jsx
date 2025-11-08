import { useState, useEffect } from "react";
import api from "../api/api";
import EventCard from "../components/EventCard";
import "../styles/UserDashboard.css";

export default function UserDashboard() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    location: ""
  });

  const fetchEvents = async () => {
    try {
      const publicRes = await api.get("/events");
      setPublicEvents(publicRes.data);

      const myRes = await api.get("/events/mine");
      setMyEvents(myRes.data);
    } catch (err) {
      console.error("Errore caricamento eventi:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEvents = publicEvents.filter((event) => {
    return (
      (!filters.date || new Date(event.date).toDateString() === new Date(filters.date).toDateString()) &&
      (!filters.category || event.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  return (
    <div className="dashboard-page">
      <h1>Benvenuto nella tua Dashboard</h1>

      <div className="filters">
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        <input type="text" name="category" placeholder="Categoria" value={filters.category} onChange={handleFilterChange} />
        <input type="text" name="location" placeholder="Luogo" value={filters.location} onChange={handleFilterChange} />
      </div>

      <section className="events-section">
        <h2>Eventi disponibili</h2>
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onAction={fetchEvents} />
          ))}
        </div>
      </section>

      <section className="events-section">
        <h2>I miei eventi</h2>
        <div className="events-grid">
          {myEvents.length > 0 ? myEvents.map(event => (
            <EventCard key={event.id} event={event} onAction={fetchEvents} />
          )) : <p>Non hai creato eventi ancora.</p>}
        </div>
      </section>

      <button className="btn-create" onClick={() => window.location.href="/create-event"}>
        Crea nuovo evento
      </button>
    </div>
  );
}
