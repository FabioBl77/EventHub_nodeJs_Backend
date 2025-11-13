// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

      // salva token
      localStorage.setItem("token", token);

      // aggiorna contesto
      login(user);

      // redirect corretto in base al ruolo
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

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

        <div className="oauth-section">
          <p className="oauth-title">Oppure accedi con</p>

          <div className="oauth-buttons">
            <button
              type="button"
              className="btn-oauth google"
              onClick={() =>
                (window.location.href = "http://localhost:3000/api/auth/google")
              }
            >
              Accedi con Google
            </button>

            <button
              type="button"
              className="btn-oauth github"
              onClick={() =>
                (window.location.href = "http://localhost:3000/api/auth/github")
              }
            >
              Accedi con GitHub
            </button>
          </div>
        </div>

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
