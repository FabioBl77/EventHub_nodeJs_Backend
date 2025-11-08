// src/pages/EventDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { io } from "socket.io-client";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Socket.io
  const socket = io("http://localhost:3000");

  useEffect(() => {
    fetchEvent();
    fetchMessages();

    // Ricevi messaggi live
    socket.on("chatMessage", (msg) => {
      if (msg.eventId === Number(id)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    // Notifiche iscrizioni live
    socket.on("registrationUpdate", (data) => {
      if (data.eventId === Number(id)) {
        fetchEvent();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Errore caricamento evento:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chats/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Errore caricamento chat:", err);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post(`/events/${id}/register`);
      socket.emit("registrationUpdate", { eventId: Number(id) });
      fetchEvent();
    } catch (err) {
      console.error("Errore iscrizione:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setLoading(true);
    try {
      await api.post(`/events/${id}/cancel`);
      socket.emit("registrationUpdate", { eventId: Number(id) });
      fetchEvent();
    } catch (err) {
      console.error("Errore annullamento iscrizione:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Sei sicuro di voler segnalare questo evento?")) return;

    try {
      await api.post(`/events/${id}/report`);
      socket.emit("eventReported", { eventId: Number(id) });
      alert("Evento segnalato agli admin!");
    } catch (err) {
      console.error("Errore segnalazione evento:", err.response?.data || err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await api.post(`/chats/${id}`, { content: newMessage });
      socket.emit("chatMessage", { ...res.data, eventId: Number(id) });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Errore invio messaggio:", err.response?.data || err);
    }
  };

  if (!event) return <p>Caricamento evento...</p>;

  return (
    <div className="event-detail-page">
      <h1>{event.title}</h1>
      {event.image && <img src={event.image} alt={event.title} className="event-image"/>}
      <p>{event.description}</p>
      <p><strong>Data:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Luogo:</strong> {event.location}</p>
      <p><strong>Categoria:</strong> {event.category}</p>
      <p><strong>Creatore:</strong> {event.creator?.username || "Sconosciuto"}</p>

      <div className="event-actions">
        <button onClick={handleRegister} disabled={loading}>Iscriviti</button>
        <button onClick={handleCancelRegistration} disabled={loading}>Annulla iscrizione</button>
        <button onClick={handleReport} disabled={loading}>Segnala</button>
      </div>

      <div className="chat-section">
        <h2>Chat evento</h2>
        <div className="chat-messages" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((msg, idx) => (
            <p key={idx}><strong>{msg.username || "Anonimo"}:</strong> {msg.content}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Invia</button>
      </div>
    </div>
  );
}
