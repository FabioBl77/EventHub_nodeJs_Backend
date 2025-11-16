import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import "../styles/EventChat.css";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export default function EventChat({ eventId, isRegistered, isBlocked }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [toast, setToast] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const isAdmin = user?.role === "admin";

  // Carica cronologia messaggi
  useEffect(() => {
    if (!isRegistered && !isAdmin) return;

    const loadChatHistory = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/events/${eventId}/chat`);
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error("Errore nel caricamento della chat:", err);
      }
    };

    loadChatHistory();
  }, [eventId, isRegistered, isAdmin]);

  // Connessione socket
  useEffect(() => {
    if (!isRegistered && !isAdmin) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit("join_event", eventId);

    socket.on("new_message", (msg) => {
      if (msg.eventId === Number(eventId) || msg.eventId === eventId) {
        setMessages((prev) => [...prev, msg]);

        if (
          msg.username === "Sistema" ||
          msg.userId === 0 ||
          msg.userId === null ||
          !msg.username
        ) {
          showToast(msg.message);
        }
      }
    });

    socket.on("user_typing", ({ username }) => {
      setTypingUser(username);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingUser(""), 2000);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, isRegistered, isAdmin]);

  // Scroll automatico
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Toast temporaneo
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  };

  // Invio messaggio
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msgData = { content: newMessage.trim() };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${SOCKET_URL}/api/events/${eventId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(msgData),
      });

      if (!res.ok) throw new Error("Errore nell'invio del messaggio");

      setNewMessage("");
    } catch (err) {
      console.error("Errore nell'invio del messaggio:", err);
      alert("Errore durante l'invio del messaggio.");
    }
  };

  // Evento "sta scrivendo"
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (socketRef.current && user?.username) {
      socketRef.current.emit("typing", {
        eventId,
        username: user.username,
      });
    }
  };

  // RENDER CONDIZIONALE — lo spostiamo QUI sotto dopo tutti gli hook
  if (isBlocked && !isAdmin) {
    return (
      <div className="chat-disabled">
        <p>La chat è disabilitata perché questo evento è stato bloccato dagli amministratori.</p>
      </div>
    );
  }

  if (!isRegistered && !isAdmin) {
    return (
      <div className="chat-disabled">
        <p>Solo gli iscritti all'evento possono partecipare alla chat.</p>
      </div>
    );
  }

  // Layout chat
  return (
    <div className="chat-container">
      {toast && <div className="chat-toast">{toast}</div>}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">Nessun messaggio ancora.</p>
        ) : (
          messages.map((msg, index) => {
            const isSystem =
              !msg.username ||
              msg.username === "Sistema" ||
              msg.userId === 0 ||
              msg.userId === null ||
              msg.userId === undefined;

            if (isSystem) {
              const text = msg.message || msg.content || "Messaggio di sistema";
              return (
                <div key={index} className="chat-system-line">
                  {text}
                </div>
              );
            }

            const isOwn = msg.userId === (user?.id || user?.userId);

            return (
              <div key={index} className={`chat-message ${isOwn ? "own" : "other"}`}>
                <div className="chat-user">{msg.username || "Utente"}</div>
                <div className="chat-text">{msg.message || msg.content}</div>
                <div className="chat-time">
                  {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}

        {typingUser && (
          <div className="typing-indicator">{typingUser} sta scrivendo...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Invia</button>
      </div>
    </div>
  );
}
