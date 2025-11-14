import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../api/events";
import { blockEventByAdmin } from "../api/admin";
import EventChat from "../components/EventChat";
import { toast } from "react-toastify";
import "../styles/AdminEventChat.css";

export default function AdminEventChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  // Carica i dettagli evento
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getEventById(id);
        const ev = res.data;
        setEvent(ev);
        setIsBlocked(ev.isBlocked || false);
      } catch (err) {
        console.error("Errore caricamento evento:", err);
        setError("Errore nel caricamento dei dettagli evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Blocca / Sblocca evento
  const handleBlock = async () => {
    try {
      await blockEventByAdmin(id);
      setIsBlocked((prev) => !prev);
      toast.success(
        `Evento ${!isBlocked ? "bloccato" : "sbloccato"} correttamente`
      );
    } catch (err) {
      console.error("Errore blocco evento:", err);
      toast.error("Errore durante il blocco/sblocco evento.");
    }
  };

  // Elimina evento
  const handleDelete = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;
    try {
      await deleteEvent(id);
      toast.success("Evento eliminato con successo!");
      setTimeout(() => navigate("/admin/events"), 1000);
    } catch (err) {
      console.error("Errore eliminazione evento:", err);
      toast.error("Errore durante l'eliminazione dell'evento.");
    }
  };

  // 🔥 USA LA PAGINA DI MODIFICA EVENTO PER ADMIN
 const handleUpdate = () => navigate(`/admin/update-event/${id}`);


  if (loading) return <p className="loading">Caricamento evento...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Evento non trovato.</p>;

  return (
    <div className="event-details-page">
      {/* Sezione immagine principale */}
      <div className="event-hero">
        <img
          src={event.image || "/default-event.jpg"}
          alt={event.title}
          className="event-hero-image"
        />
        <div className="event-hero-overlay">
          <h1>{event.title}</h1>
          <p className="event-category">{event.category}</p>
        </div>
      </div>

      {/* Contenitore principale dettagli */}
      <div className="event-details-container">
        <div className="event-info-section">
          <h2>Dettagli evento</h2>
          <p><strong>Descrizione:</strong> {event.description}</p>
          <p><strong>Data:</strong> {event.date ? new Date(event.date).toLocaleDateString("it-IT") : "N/D"}</p>
          <p><strong>Luogo:</strong> {event.location}</p>
          <p><strong>Capienza:</strong> {event.capacity}</p>
          <p><strong>Creatore:</strong> {event.creatorName || "Sconosciuto"}</p>
        </div>

        {/* Pulsanti amministratore */}
        <div className="event-actions admin-actions">
          <div className="edit-delete-row">
            <button className="btn-action btn-update" onClick={handleUpdate}>
              Modifica evento
            </button>
            <button className="btn-action btn-delete" onClick={handleDelete}>
              Elimina evento
            </button>
          </div>

          <button
            className={`btn-action ${isBlocked ? "btn-unblock" : "btn-block"}`}
            onClick={handleBlock}
          >
            {isBlocked ? "Sblocca evento" : "Blocca evento"}
          </button>
        </div>

        {/* Chat live */}
        <div className="event-chat-section">
          <h2>Chat live evento</h2>
          <EventChat eventId={id} isRegistered={true} isBlocked={isBlocked} />
        </div>
      </div>
    </div>
  );
}
