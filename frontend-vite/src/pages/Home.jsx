// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", category: "", location: "" });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        setLatestEvents(res.data.slice(-3).reverse()); // ultimi 3 eventi
      } catch (err) {
        console.error("Errore fetch eventi:", err);
      }
    };
    fetchEvents();
  }, []);

  // Carosello automatico ogni 3 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % latestEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [latestEvents]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEvents = events.filter(event => {
    return (
      (!filters.date || event.date.startsWith(filters.date)) &&
      (!filters.category || event.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  return (
    <div className="home-page">
      <h1 className="home-title">Benvenuto su EventHub</h1>

      {/* Carosello ultimi 3 eventi */}
      <div className="carousel">
        {latestEvents.map((event, index) => (
          <div
            key={event.id}
            className={`carousel-item ${index === currentSlide ? "active" : ""}`}
          >
            <img src={event.image} alt={event.title} />
            <div className="carousel-caption">{event.title}</div>
          </div>
        ))}
      </div>

      {/* Filtri */}
      <div className="filters">
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        <input type="text" name="category" placeholder="Categoria" value={filters.category} onChange={handleFilterChange} />
        <input type="text" name="location" placeholder="Luogo" value={filters.location} onChange={handleFilterChange} />
      </div>

      {/* Lista eventi */}
      <div className="event-list">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.image} alt={event.title} />
            <h3>{event.title}</h3>
            <p>{event.date} - {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
