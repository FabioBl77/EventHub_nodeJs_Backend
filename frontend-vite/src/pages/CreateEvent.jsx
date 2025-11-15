import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const [imgError, setImgError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "image") {
      setImgError(false); // reset errore anteprima
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/events", form);
      toast.success("Evento creato con successo! 🎉", { position: "top-center" });
      navigate("/dashboard");
    } catch (err) {
      console.error("Errore creazione evento:", err);
      const msg =
        err.response?.data?.message ||
        "Errore durante la creazione dell'evento.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-card">
        <h1>Crea un nuovo evento</h1>

        {/* 🔥 PREVIEW IMMAGINE */}
        <div className="image-preview-container">
          {form.image && !imgError ? (
            <img
              src={form.image}
              alt="Anteprima evento"
              className="image-preview"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="image-placeholder">
              Nessuna anteprima disponibile
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Titolo</label>
          <input
            type="text"
            name="title"
            placeholder="Titolo dell'evento"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Descrizione</label>
          <textarea
            name="description"
            placeholder="Descrizione evento"
            value={form.description}
            onChange={handleChange}
            rows="6"
            className="textarea-large"
            required
          />

          <label>Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Luogo</label>
          <input
            type="text"
            name="location"
            placeholder="Luogo dell'evento"
            value={form.location}
            onChange={handleChange}
            required
          />

          <label>Capienza</label>
          <input
            type="number"
            name="capacity"
            placeholder="Numero massimo di partecipanti"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <label>Categoria</label>
          <input
            type="text"
            name="category"
            placeholder="Categoria (es. musica, sport, arte...)"
            value={form.category}
            onChange={handleChange}
            required
          />

          <label>Immagine (URL)</label>
          <input
            type="text"
            name="image"
            placeholder="URL immagine evento"
            value={form.image}
            onChange={handleChange}
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creazione in corso..." : "Crea evento"}
          </button>
        </form>
      </div>
    </div>
  );
}
