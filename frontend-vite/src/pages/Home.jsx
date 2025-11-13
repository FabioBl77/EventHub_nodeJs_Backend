// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import Filters from "../components/Filters"; // ✅ aggiunto
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
        setLatestEvents(res.data.slice(-3).reverse()); // ultimi 3 eventi
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

  // --- Filtro eventi ---
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
    const matchDate =
      !filters.date || event.date.startsWith(filters.date);

    return matchTitle && matchCategory && matchLocation && matchDate;
  });

  return (
    <div className="home-page">
      <h1 className="home-title">Benvenuto su EventHub</h1>

      {/* --- Carosello ultimi eventi --- */}
      <div className="carousel">
        {latestEvents.map((event, index) => (
          <div
            key={event.id}
            className={`carousel-item ${
              index === currentSlide ? "active" : ""
            }`}
          >
            <img src={event.image} alt={event.title} />
            <div className="carousel-caption">{event.title}</div>
          </div>
        ))}
      </div>

      <div className="home-intro">
        <h2>Cos'è EventHub</h2>
        <p>
    <strong>EventHub</strong> è la piattaforma ideale per scoprire, creare e vivere eventi in modo semplice e intuitivo.
    Che tu sia un appassionato alla ricerca di nuove esperienze o un organizzatore che vuole far conoscere le proprie iniziative,
    EventHub ti offre tutti gli strumenti per gestire ogni fase con facilità.
  </p>
  <p>
    Puoi <strong>esplorare centinaia di eventi</strong> filtrandoli per categoria, data o località,
    <strong> iscriverti con un solo clic</strong> e <strong>interagire in tempo reale</strong> con gli altri partecipanti
    grazie alla <strong>chat dedicata</strong>.
  </p>
  <p>
    Se invece sei un creatore di eventi, avrai la possibilità di <strong>pubblicare, modificare e gestire</strong> le tue attività
    direttamente dal tuo profilo personale, mantenendo sempre il controllo completo.
  </p>
  <p>
    Unisciti alla community di EventHub e <strong>trasforma ogni evento in un’esperienza unica</strong>,
    fatta di condivisione, scoperta e connessioni autentiche!
  </p>
      </div>


      {/* --- Filtro eventi --- */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* --- Lista eventi --- */}
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} alt={event.title} />
              <h3>{event.title}</h3>
              <p>
                {event.date} - {event.location}
              </p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p className="no-events">Nessun evento trovato.</p>
        )}
      </div>
    </div>
  );
}
