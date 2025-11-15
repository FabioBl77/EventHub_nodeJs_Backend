import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/UpdateEvent.css"; // Usa lo stesso stile del form user

export default function AdminUpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carica i dati dell'evento
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          date: event.date
            ? new Date(event.date).toISOString().slice(0, 16)
            : "",
          location: event.location || "",
          capacity: event.capacity || "",
          category: event.category || "",
          image: event.image || "",
        });
      } catch (err) {
        console.error("Errore nel caricamento dell'evento:", err);
        toast.error("Errore nel caricamento dei dati dell'evento.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Gestione input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Salva modifiche (ADMIN)
const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    await api.put(`/admin/events/${id}`, formData);
    toast.success("Evento aggiornato con successo!", { position: "top-center" });

    // 🔥 Redirect corretto alla pagina admin
    navigate(`/admin/event-chat/${id}`);
  } catch (err) {
    console.error("Errore aggiornamento evento admin:", err);
    const msg = err.response?.data?.message || "Errore durante l'aggiornamento dell'evento.";
    toast.error(msg, { position: "top-center" });
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className="loading">Caricamento evento...</p>;

  return (
    <div className="update-event-page">
      <div className="update-event-card">
        <h1>Modifica Evento (Admin)</h1>

        <form onSubmit={handleSubmit}>
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
            required
          />

          <label>Categoria</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          <label>Immagine (URL)</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />

          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </button>
        </form>

        <button
        className="btn-secondary"
        onClick={() => navigate(`/admin/event-chat/${id}`)}
        disabled={saving}
        >
        Annulla
        </button>
      </div>
    </div>
  );
}
