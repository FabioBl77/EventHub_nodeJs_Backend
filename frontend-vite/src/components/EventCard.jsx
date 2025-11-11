import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerToEvent, cancelRegistration } from "../api/events";
import { toast } from "react-toastify"; // 🔹 import toastify
import "../styles/EventCard.css";

export default function EventCard({ event, isRegistered, onToggleRegistration }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Devi essere loggato per iscriverti a un evento.", {
          position: "top-center",
        });
        navigate("/login");
        return;
      }

      setLoading(true);

      if (isRegistered) {
        // 🔹 Annulla iscrizione
        await cancelRegistration(event.id);
        toast.info(`Hai annullato l'iscrizione all'evento "${event.title}"`, {
          position: "top-center",
        });
        onToggleRegistration && onToggleRegistration(event.id, false);
      } else {
        // 🔹 Nuova iscrizione
        await registerToEvent(event.id);
        toast.success(`Ti sei iscritto all'evento "${event.title}"!`, {
          position: "top-center",
        });
        onToggleRegistration && onToggleRegistration(event.id, true);
      }
    } catch (error) {
      console.error("Errore durante l'iscrizione/annullamento:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Si è verificato un errore, riprova più tardi.";

      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
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

        {/* 🔹 Bottone dinamico */}
        <button
          className={`action-btn ${isRegistered ? "btn-cancel" : "btn-join"}`}
          onClick={handleRegistration}
          disabled={loading}
        >
          {loading
            ? "Attendere..."
            : isRegistered
            ? "Annulla iscrizione"
            : "Iscriviti"}
        </button>

        {/* 🔹 Link ai dettagli evento */}
        <Link to={`/event/${event.id}`} className="details-btn">
          Dettagli
        </Link>
      </div>
    </div>
  );
}
