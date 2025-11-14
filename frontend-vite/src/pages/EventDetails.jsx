import { useEffect, useState, useContext, useRef } from "react";
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
  const redirectDone = useRef(false);

  const [event, setEvent] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reporting, setReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const currentUserId = user?.userId || user?.id || null;

  const safeRedirect = () => {
    if (!redirectDone.current) {
      redirectDone.current = true;
      navigate("/dashboard");
    }
  };

  const checkEventStatus = async () => {
    try {
      const res = await getEventById(id);
      const ev = res.data;

      if (!ev) {
        toast.error("Questo evento non è più disponibile.", {
          position: "top-center",
        });
        safeRedirect();
        return false;
      }

      if (ev.isBlocked && user?.role !== "admin") {
        toast.error("Questo evento è stato bloccato dagli amministratori.", {
          position: "top-center",
        });
        safeRedirect();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Errore in checkEventStatus:", error);
      toast.error("Evento eliminato o non disponibile.", {
        position: "top-center",
      });
      safeRedirect();
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const isValid = await checkEventStatus();
        if (!isValid) return;

        const [eventRes, dashRes] = await Promise.allSettled([
          getEventById(id),
          currentUserId ? api.get("/events/dashboard") : Promise.resolve({ data: null }),
        ]);

        if (eventRes.status === "fulfilled") {
          const ev = eventRes.value.data;
          setEvent(ev);

          const creatorId =
            ev.createdBy ||
            ev.creatorId ||
            ev.creator?.id ||
            ev.creator_id ||
            null;

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
          toast.error("Evento non disponibile o eliminato.", {
            position: "top-center",
          });
          safeRedirect();
        }
      } catch (error) {
        console.error("Errore nel caricamento dettagli evento:", error);
        setError("Errore nel caricamento dei dettagli evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUserId, navigate, user]);

  const handleDelete = async () => {
    const ok = await checkEventStatus();
    if (!ok) return;

    try {
      await deleteEvent(id);
      toast.success("Evento eliminato con successo!", {
        position: "top-center",
      });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      console.error("Errore durante l'eliminazione evento:", error);
      toast.error("Errore durante la cancellazione dell'evento.", {
        position: "top-center",
      });
    }
  };

  const handleUpdate = async () => {
    const ok = await checkEventStatus();
    if (!ok) return;
    navigate(`/update-event/${id}`);
  };

  const handleRegistration = async () => {
    const ok = await checkEventStatus();
    if (!ok) return;

    try {
      if (!currentUserId) {
        toast.warning("Devi essere loggato per iscriverti a un evento.", {
          position: "top-center",
        });
        navigate("/login");
        return;
      }

      if (isRegistered) {
        await cancelRegistration(id);
        setIsRegistered(false);
        toast.info("Hai annullato la tua iscrizione all'evento.", {
          position: "top-center",
        });
      } else {
        await registerToEvent(id);
        setIsRegistered(true);
        toast.success("Iscrizione avvenuta con successo.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Errore gestione iscrizione:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Errore nella gestione dell'iscrizione.";
      toast.error(msg, { position: "top-center" });
    }
  };

  const openReportModal = async () => {
    const ok = await checkEventStatus();
    if (!ok) return;
    setShowReportModal(true);
  };

  if (loading) {
    return <p className="loading">Caricamento dettagli evento...</p>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <br />
        <button onClick={() => navigate("/dashboard")} className="btn">
          Torna alla Dashboard
        </button>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="event-details-page">
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

      <div className="event-details-container">
        <div className="event-info-section">
          <h2>Dettagli evento</h2>
          <p>
            <strong>Descrizione:</strong> {event.description}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {event.date
              ? new Date(event.date).toLocaleDateString("it-IT")
              : "N/D"}
          </p>
          <p>
            <strong>Luogo:</strong> {event.location}
          </p>
          <p>
            <strong>Capienza:</strong> {event.capacity}
          </p>
          <p>
            <strong>Creatore:</strong> {event.creatorName || "Sconosciuto"}
          </p>
        </div>

        <div className="event-actions">
          {isCreator || user?.role === "admin" ? (
            <>
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
              <div className="creator-info">
                Solo il creatore di questo evento o un amministratore possono
                modificarlo o eliminarlo.
                <br />
                Evento creato da{" "}
                <strong>{event.creatorName || "Utente sconosciuto"}</strong>.
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

        <div className="event-chat-section">
          <h2>Chat dell'evento</h2>
          <EventChat
            eventId={id}
            isRegistered={isRegistered}
            isBlocked={event.isBlocked}
          />
        </div>
      </div>

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
                    toast.success(
                      "Evento segnalato agli amministratori",
                      { position: "top-center" }
                    );
                  } catch (error) {
                    console.error("Errore segnalazione evento:", error);
                    toast.error("Errore nella segnalazione dell'evento", {
                      position: "top-center",
                    });
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
