// src/components/EventCard.jsx
import { useState } from "react";
import api from "../api/api";
import "../styles/EventCard.css";

export default function EventCard({ event, onAction, userId }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await api.post(`/events/${event.id}/register`);
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setLoading(true);
      await api.post(`/events/${event.id}/cancel`);
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;
    try {
      setLoading(true);
      await api.delete(`/events/${event.id}`);
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isCreator = userId === event.createdBy;

  return (
    <div className="event-card">
      <img src={event.image || "/default-event.jpg"} alt={event.title} className="event-image" />
      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Luogo:</strong> {event.location}</p>
        <p><strong>Categoria:</strong> {event.category}</p>

        <div className="event-actions">
          {event.registered ? (
            <button className="btn cancel" onClick={handleCancelRegistration} disabled={loading}>
              Annulla iscrizione
            </button>
          ) : (
            <button className="btn register" onClick={handleRegister} disabled={loading}>
              Iscriviti
            </button>
          )}

          {isCreator && (
            <>
              <button className="btn edit" onClick={() => window.location.href = `/edit-event/${event.id}`}>
                Modifica
              </button>
              <button className="btn delete" onClick={handleDelete} disabled={loading}>
                Elimina
              </button>
            </>
          )}

          <button className="btn details" onClick={() => window.location.href = `/event/${event.id}`}>
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
}
