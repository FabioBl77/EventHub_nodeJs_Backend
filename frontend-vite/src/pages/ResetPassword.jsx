import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // riutilizziamo lo stile della login

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      // opzionale: reindirizza al login dopo 3 secondi
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Errore durante il reset della password.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset password</h1>
        <p className="subtitle">Inserisci la nuova password</p>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nuova password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Conferma password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn">Aggiorna password</button>
        </form>

        <p className="signup-text">
          Torna al <Link to="/login">login</Link>
        </p>
      </div>
    </div>
  );
}
