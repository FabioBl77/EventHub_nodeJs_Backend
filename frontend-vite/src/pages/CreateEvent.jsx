// src/pages/CreateEvent.jsx
import { useState } from "react";
import api from "../api/api";
import "../styles/CreateEvent.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    category: "",
    image: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/events", form);
      setMessage("✅ Evento creato con successo!");
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
        category: "",
        image: ""
      });
    } catch (err) {
      console.error("Errore creazione evento:", err);
      setMessage("❌ Errore durante la creazione dell'evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-card">
        <h1>Crea un nuovo evento</h1>

        <form onSubmit={handleSubmit}>
          <label>Titolo</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />

          <label>Descrizione</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />

          <label>Data</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <label>Luogo</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required />

          <label>Capienza</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required />

          <label>Categoria</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} required />

          <label>Immagine (URL)</label>
          <input type="text" name="image" value={form.image} onChange={handleChange} />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creazione..." : "Crea evento"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
