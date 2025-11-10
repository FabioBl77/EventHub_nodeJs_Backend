import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/events";
import "../styles/CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 📌 Gestione input testo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 📸 Gestione immagine
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // 🚀 Invia evento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await createEvent(data);
      setSuccess("Evento creato con successo!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Errore nella creazione evento:", err);
      setError("Errore nella creazione dell'evento. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <h1>Crea un nuovo evento</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="create-event-form">
        <label>Titolo</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Descrizione</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />

        <label>Data</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Luogo</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Capienza</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Categoria</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona una categoria</option>
          <option value="musica">Musica</option>
          <option value="sport">Sport</option>
          <option value="teatro">Teatro</option>
          <option value="tecnologia">Tecnologia</option>
          <option value="altro">Altro</option>
        </select>

        <label>Immagine (opzionale)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Creazione in corso..." : "Crea evento"}
        </button>
      </form>
    </div>
  );
}
