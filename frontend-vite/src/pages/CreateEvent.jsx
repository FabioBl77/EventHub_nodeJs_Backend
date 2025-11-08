import { useState } from "react";
import api from "../api/api"; // Assicurati che il percorso sia corretto

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Invio dati al backend
      await api.post("/events", form);

      // Messaggio di successo
      setMessage("Evento creato con successo!");
      // Eventualmente pulire il form
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
        image: ""
      });

    } catch (err) {
      console.error("Errore creazione evento:", err);
      setMessage("Errore durante la creazione dell'evento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <h1>Crea un nuovo evento</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Titolo" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Descrizione" value={form.description} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="location" placeholder="Luogo" value={form.location} onChange={handleChange} required />
        <input type="number" name="capacity" placeholder="Capienza" value={form.capacity} onChange={handleChange} required />
        <input name="image" placeholder="URL immagine" value={form.image} onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crea Evento"}
        </button>
      </form>
    </div>
  );
}
