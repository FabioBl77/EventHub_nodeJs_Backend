import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css"; // riutilizziamo lo stile della login

export default function ConfirmEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await api.get(`/auth/confirm-email/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Errore durante la conferma email.");
        }
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Conferma Email</h1>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p className="signup-text">
          Vai al <Link to="/login">login</Link> per accedere al tuo account.
        </p>
      </div>
    </div>
  );
}
