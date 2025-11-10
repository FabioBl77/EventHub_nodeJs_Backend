import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // riutilizziamo lo stile della login

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Errore durante l’invio della richiesta.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Recupero password</h1>
        <p className="subtitle">Inserisci la tua email per ricevere il link di reset</p>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn">Invia link</button>
        </form>

        <p className="signup-text">
          Ricordi la password? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
