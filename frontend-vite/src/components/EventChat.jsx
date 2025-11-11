import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import "../styles/EventChat.css";

const SOCKET_URL = "http://localhost:3000"; // backend base URL

export default function EventChat({ eventId, isRegistered }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [toast, setToast] = useState(""); // 👈 nuovo stato per notifiche
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  // 🔹 Carica la cronologia messaggi
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/events/${eventId}/chat`);
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error("Errore nel caricamento della chat:", err);
      }
    };

    if (isRegistered) loadChatHistory();
  }, [eventId, isRegistered]);

  // 🔹 Connessione Socket.IO
  useEffect(() => {
    if (!isRegistered) return;

    // Non forzare solo websocket: lascia polling+upgrade per compatibilità
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit("join_event", eventId);

    // Ricezione nuovi messaggi
    socket.on("new_message", (msg) => {
      if (msg.eventId === Number(eventId) || msg.eventId === eventId) {
        setMessages((prev) => [...prev, msg]);

        // 👀 Mostra toast se è un messaggio di sistema
        if (msg.username === "Sistema" || msg.userId === 0) {
          showToast(msg.message);
        }
      }
    });

    // 👂 Ascolta "sta scrivendo"
    socket.on("user_typing", ({ username }) => {
      setTypingUser(username);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingUser(""), 2000);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, isRegistered]);

  // 🔹 Scroll automatico
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Toast temporaneo
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  };

  // 🔹 Invio messaggio
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

    if (!res.ok) throw new Error("Errore nell'invio messaggio");

    // 👇 NON aggiungiamo più il messaggio manualmente,
    // arriverà via Socket.IO come tutti gli altri.
    setNewMessage("");
  } catch (err) {
    console.error("Errore nell'invio del messaggio:", err);
    alert("Errore durante l'invio del messaggio.");
  }
};


  // 🔹 Segnala al server che sto scrivendo
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socketRef.current && user?.username) {
      socketRef.current.emit("typing", {
        eventId,
        username: user.username,
      });
    }
  };

  // 🔹 Blocco chat per non iscritti
  if (!isRegistered) {
    return (
      <div className="chat-disabled">
        <p>💬 Solo gli iscritti all'evento possono partecipare alla chat.</p>
      </div>
    );
  }

  // 🔹 Layout completo
  return (
    <div className="chat-container">
      {/* 🔔 Toast notifica */}
      {toast && <div className="chat-toast">{toast}</div>}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">Nessun messaggio ancora.</p>
        ) : (
          messages.map((msg, index) => {
            const isSystem = msg.username === "Sistema" || msg.userId === 0;

            return (
              <div
                key={index}
                className={`chat-message ${
                  isSystem
                    ? "system"
                    : msg.userId === (user?.id || user?.userId)
                    ? "own"
                    : "other"
                }`}
              >
                {isSystem ? (
                  <div className="chat-text">{msg.message || msg.content}</div>
                ) : (
                  <>
                    <div className="chat-user">
                      {msg.username || `Utente ${msg.userId}`}
                    </div>
                    <div className="chat-text">
                      {msg.message || msg.content}
                    </div>
                    <div className="chat-time">
                      {new Date(
                        msg.timestamp || msg.createdAt
                      ).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}

        {/* 👇 Mostra indicatore typing */}
        {typingUser && (
          <div className="typing-indicator">
            💭 {typingUser} sta scrivendo...
          </div>
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
