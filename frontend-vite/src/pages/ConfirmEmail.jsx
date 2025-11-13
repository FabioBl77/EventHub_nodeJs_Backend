import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // stile condiviso

export default function ConfirmEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await api.get(`/auth/confirm-email/${token}`);
        setMessage(res.data.message || "Email confermata con successo!");
      } catch (err) {
        console.error("Errore conferma email:", err);
        const msg =
          err?.response?.data?.message || "Errore durante la conferma dell'email.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Conferma Email</h1>

        {loading ? (
          <p className="loading-text">Verifica in corso...</p>
        ) : message ? (
          <p className="success">{message}</p>
        ) : (
          <p className="error">{error}</p>
        )}

        {!loading && (
          <p className="signup-text">
            Vai al <Link to="/login">login</Link> per accedere al tuo account.
          </p>
        )}
      </div>
    </div>
  );
}
