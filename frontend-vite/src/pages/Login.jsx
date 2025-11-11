// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ prendiamo la funzione login dal contesto

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      const { user, token } = res.data;

      // ✅ salva il token per le chiamate API
      localStorage.setItem("token", token);

      // ✅ aggiorna subito il contesto → Navbar si aggiorna senza refresh
      login(user);

      // ✅ redirect alla dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Errore durante il login.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Accedi a EventHub</h1>
        <p className="subtitle">Benvenuto! Inserisci le tue credenziali</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn">
            Accedi
          </button>
        </form>

        <p className="forgot-password">
          <Link to="/forgot-password">Hai dimenticato la password?</Link>
        </p>

        <p className="signup-text">
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </div>
    </div>
  );
}
