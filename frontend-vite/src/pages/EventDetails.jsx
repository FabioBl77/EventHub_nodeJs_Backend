import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  deleteEvent,
  registerToEvent,
  cancelRegistration,
  reportEvent,
} from "../api/events";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import EventChat from "../components/EventChat";
import { toast } from "react-toastify";
import "../styles/EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reporting, setReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const currentUserId = user?.userId || user?.id || null;

  // Caricamento evento + dashboard utente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [eventRes, dashRes] = await Promise.allSettled([
          getEventById(id),
          currentUserId ? api.get("/events/dashboard") : Promise.resolve({ data: null }),
        ]);

        if (eventRes.status === "fulfilled") {
          const ev = eventRes.value.data;
          setEvent(ev);

          const creatorId =
            ev.createdBy || ev.creatorId || ev.creator?.id || ev.creator_id || null;
          setIsCreator(creatorId === currentUserId);

          if (dashRes.status === "fulfilled" && dashRes.value?.data?.joinedEvents) {
            const joinedIds = dashRes.value.data.joinedEvents.map((e) => e.id);
            setIsRegistered(joinedIds.includes(Number(id)));
          } else if (ev.isUserRegistered) {
            setIsRegistered(true);
          } else {
            setIsRegistered(false);
          }
        } else {
          setError("Errore nel caricamento dell'evento.");
        }
      } catch (err) {
        console.error("Errore nel caricamento dettagli evento:", err);
        setError("Errore nel caricamento dei dettagli evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUserId]);

  // Elimina evento
const handleDelete = async () => {

  try {
    await deleteEvent(id);
    toast.success("Evento eliminato con successo!", { position: "top-center" });
    setTimeout(() => navigate("/dashboard"), 1200);
  } catch (err) {
    console.error("Errore durante l'eliminazione evento:", err);
    toast.error("Errore durante la cancellazione dell'evento.", { position: "top-center" });
  }
};


  // Modifica evento
  const handleUpdate = () => navigate(`/update-event/${id}`);

  // Gestione iscrizione / disiscrizione
  const handleRegistration = async () => {
    try {
      if (!currentUserId) {
        toast.warning("Devi essere loggato per iscriverti a un evento.", { position: "top-center" });
        navigate("/login");
        return;
      }

      if (isRegistered) {
        await cancelRegistration(id);
        setIsRegistered(false);
        toast.info("Hai annullato la tua iscrizione all'evento.", { position: "top-center" });
      } else {
        await registerToEvent(id);
        setIsRegistered(true);
        toast.success("Iscrizione avvenuta con successo.", { position: "top-center" });
      }
    } catch (err) {
      console.error("Errore gestione iscrizione:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Errore nella gestione dell'iscrizione.";
      toast.error(msg, { position: "top-center" });
    }
  };

  // Apri modale segnalazione evento
  const openReportModal = () => setShowReportModal(true);

  // Stati UI
  if (loading) return <p className="loading">Caricamento dettagli evento...</p>;
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

        {/* Sezione pulsanti azione */}
        <div className="event-actions">
          {isCreator || user?.role === "admin" ? (
            <>
              {/* Pulsanti Modifica / Elimina */}
              <div className="edit-delete-row">
                <button className="btn-action btn-update" onClick={handleUpdate}>
                  Modifica evento
                </button>
                <button className="btn-action btn-delete" onClick={handleDelete}>
                  Elimina evento
                </button>
              </div>


              <button
                className={`btn ${isRegistered ? "btn-cancel" : "btn-join"}`}
                onClick={handleRegistration}
              >
                {isRegistered ? "Annulla iscrizione" : "Iscriviti"}
              </button>

              <p className="report-text" onClick={openReportModal}>
                Segnala evento
              </p>
            </>
          ) : (
            <>
             {/* Barra informativa per non-creatori */}
            <div className="creator-info">
              Solo il creatore di questo evento o un amministratore possono modificarlo o eliminarlo.
              <br />
              Evento creato da <strong>{event.creatorName || "Utente sconosciuto"}</strong>.
            </div>


              <button
                className={`btn ${isRegistered ? "btn-cancel" : "btn-join"}`}
                onClick={handleRegistration}
              >
                {isRegistered ? "Annulla iscrizione" : "Iscriviti"}
              </button>

              <p className="report-text" onClick={openReportModal}>
                Segnala evento
              </p>
            </>
          )}
        </div>

        {/* Sezione chat evento */}
        <div className="event-chat-section">
          <h2>Chat dell'evento</h2>
          <EventChat eventId={id} isRegistered={isRegistered} />
        </div>
      </div>

      {/* Modale segnalazione evento */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Segnala evento</h3>
            <p>Spiega brevemente il motivo della segnalazione:</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Scrivi qui il motivo..."
              rows="4"
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
              >
                Annulla
              </button>
              <button
                className="btn-send"
                disabled={reporting || !reportReason.trim()}
                onClick={async () => {
                  try {
                    setReporting(true);
                    await reportEvent(id, reportReason);
                    toast.success("Evento segnalato agli amministratori", { position: "top-center" });
                  } catch (err) {
                    console.error("Errore segnalazione evento:", err);
                    toast.error("Errore nella segnalazione dell'evento", { position: "top-center" });
                  } finally {
                    setReporting(false);
                    setShowReportModal(false);
                    setReportReason("");
                  }
                }}
              >
                Invia segnalazione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
