import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Controlla che le password coincidano
    if (form.password !== form.confirmPassword) {
      toast.warning("Le password non coincidono.", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success(
        "Registrazione completata! Controlla la tua email per confermare l'account.",
        { position: "top-center", autoClose: 5000 }
      );

      navigate("/login");
    } catch (err) {
      console.error("Errore registrazione:", err);
      const msg =
        err.response?.data?.message ||
        "Errore durante la registrazione. Riprova più tardi.";
      toast.error(msg, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Crea un nuovo account</h1>
        <p className="subtitle">Registrati su EventHub per creare o scoprire eventi</p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Il tuo nome utente"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="La tua email"
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
            placeholder="Ripeti la password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="login-text">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
