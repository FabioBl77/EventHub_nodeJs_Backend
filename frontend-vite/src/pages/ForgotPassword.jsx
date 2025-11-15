import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // riutilizziamo lo stile della login

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Errore durante l’invio della richiesta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Recupero password</h1>
        <p className="subtitle">
          Inserisci la tua email e ti invieremo un link per reimpostare la password.
        </p>

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

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Invio in corso..." : "Invia link"}
          </button>
        </form>

        <p className="signup-text">
          Ricordi la password? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
