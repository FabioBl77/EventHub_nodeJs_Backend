// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import Filters from "../components/Filters";
import "../styles/home.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    date: "",
    category: "",
    location: "",
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Caricamento eventi ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        setLatestEvents(res.data.slice(-3).reverse());
      } catch (err) {
        console.error("Errore fetch eventi:", err);
      }
    };
    fetchEvents();
  }, []);

  // --- Carosello automatico ---
  useEffect(() => {
    if (latestEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % latestEvents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [latestEvents]);

  // --- Filtri ---
  const filteredEvents = events.filter((event) => {
    const matchTitle =
      !filters.title ||
      event.title.toLowerCase().includes(filters.title.toLowerCase());

    const matchCategory =
      !filters.category ||
      event.category.toLowerCase().includes(filters.category.toLowerCase());

    const matchLocation =
      !filters.location ||
      event.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchDate = !filters.date || event.date.startsWith(filters.date);

    return matchTitle && matchCategory && matchLocation && matchDate;
  });

  return (
    <div className="home-page">
      <h1 className="home-title">Benvenuto su EventHub</h1>

      {/* --- CAROSELLO --- */}
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

      {/* --- INTRO --- */}
      <div className="home-intro">
        <h2>Cos'è EventHub</h2>

        <p>
          <strong>EventHub</strong> è la piattaforma ideale per scoprire, creare
          e vivere eventi in modo semplice e intuitivo. Che tu sia un
          appassionato alla ricerca di nuove esperienze o un organizzatore che
          vuole far conoscere le proprie iniziative, EventHub ti offre tutti gli
          strumenti per gestire ogni fase con facilità.
        </p>

        <p>
          Puoi <strong>esplorare centinaia di eventi</strong> filtrandoli per
          categoria, data o località, <strong>iscriverti con un solo clic</strong>{" "}
          e <strong>interagire in tempo reale</strong> con gli altri
          partecipanti grazie alla chat dedicata.
        </p>

        <p>
          Se invece sei un creatore di eventi, avrai la possibilità di{" "}
          <strong>pubblicare, modificare e gestire</strong> le tue attività
          direttamente dal tuo profilo personale.
        </p>

        <p>
          Entra nella community EventHub e{" "}
          <strong>trasforma ogni evento in un’esperienza unica!</strong>
        </p>
      </div>

      {/* --- FILTRI --- */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* --- LISTA EVENTI --- */}
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-wrapper">
                <img src={event.image} alt={event.title} />
                <span className="event-category-tag">{event.category}</span>
              </div>

              <div className="event-info">
                <h3>{event.title}</h3>

                <p className="event-date-location">
                  {new Date(event.date).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {" • "}
                  {event.location}
                </p>

                <p className="event-description">
                  {event.description?.slice(0, 90)}...
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">Nessun evento trovato.</p>
        )}
      </div>
    </div>
  );
}
