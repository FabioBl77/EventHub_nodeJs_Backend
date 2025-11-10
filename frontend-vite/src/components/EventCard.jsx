import { Link } from "react-router-dom";
import { registerToEvent, cancelRegistration } from "../api/events";
import "../styles/EventCard.css";

export default function EventCard({ event, onAction, isRegisteredSection = false }) {
  // Gestione iscrizione / annullamento
  const handleRegistration = async () => {
    try {
      if (isRegisteredSection) {
        await cancelRegistration(event.id);
        alert("Hai annullato la tua iscrizione all'evento!");
      } else {
        await registerToEvent(event.id);
        alert("Ti sei iscritto con successo all'evento!");
      }

      if (onAction) onAction(); // aggiorna dashboard
    } catch (error) {
      console.error("Errore durante l'iscrizione:", error);
      alert("Si è verificato un errore, riprova più tardi.");
    }
  };

  return (
    <div className="event-card">
      <img
        src={event.image || "/default-event.jpg"}
        alt={event.title}
        className="event-image"
      />

      <div className="event-info">
        <h3>{event.title}</h3>
        {event.description && (
          <p>{event.description.substring(0, 100)}...</p>
        )}
        <p>
          <strong>Luogo:</strong> {event.location}
        </p>
        <p>
          <strong>Data:</strong>{" "}
          {event.date ? new Date(event.date).toLocaleDateString("it-IT") : "N/D"}
        </p>

        {/* 🔹 Bottone iscrizione o annullamento */}
        <button
          className={`action-btn ${
            isRegisteredSection ? "btn-cancel" : "btn-join"
          }`}
          onClick={handleRegistration}
        >
          {isRegisteredSection ? "Annulla iscrizione" : "Iscriviti"}
        </button>

        {/* 🔹 Pulsante Dettagli */}
        <Link to={`/event/${event.id}`} className="details-btn">
          Dettagli
        </Link>
      </div>
    </div>
  );
}
