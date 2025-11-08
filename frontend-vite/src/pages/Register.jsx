import { useState } from "react";
import api from "../api/api"; // l'istanza Axios creata in src/api/api.js
import "../styles/Login.css"; // riutilizziamo lo stile esistente

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(""); // messaggi di successo/errore
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // semplice validazione lato client
    if (form.password !== form.confirmPassword) {
      setMessage("Le password non coincidono");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setMessage(res.data.message); // "Registrazione completata. Controlla la tua email..."
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Errore durante la registrazione");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Crea il tuo account</h1>
        <p className="subtitle">Unisciti alla community di EventHub</p>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nome completo</label>
          <input
            type="text"
            name="username"
            placeholder="Es. Mario Rossi"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Inserisci la tua email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Conferma Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="signup-text">
          Hai già un account? <a href="/login">Accedi</a>
        </p>
      </div>
    </div>
  );
}
