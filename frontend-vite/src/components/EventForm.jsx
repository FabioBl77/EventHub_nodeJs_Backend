import { useState, useEffect } from "react";
import api from "../api/api";

export default function EventForm({ event = null, onEventCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    category: "",
    image: ""
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        date: event.date.slice(0, 10),
        location: event.location,
        capacity: event.capacity,
        category: event.category,
        image: event.image
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event) {
        // Modifica evento esistente
        await api.put(`/events/${event.id}`, form);
        alert("Evento aggiornato con successo!");
      } else {
        // Creazione nuovo evento
        await api.post("/events", form);
        alert("Evento creato con successo!");
      }
      if (onEventCreated) onEventCreated();
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
      console.error("Errore creazione/aggiornamento evento:", err);
      alert("Si è verificato un errore. Controlla i dati inseriti.");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
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

      <button type="submit">{event ? "Aggiorna Evento" : "Crea Evento"}</button>
    </form>
  );
}
