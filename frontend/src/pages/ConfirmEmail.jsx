import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Conferma in corso...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/confirm-email/${token}`);
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message || "Email confermata con successo!");
          setTimeout(() => navigate("/login"), 2500); // reindirizza al login dopo 2.5s
        } else {
          setMessage(data.message || "Errore nella conferma dell'email");
        }
      } catch (err) {
        console.error(err);
        setMessage("Errore durante la conferma dell'email");
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
      {message.includes("successo") && <p>Verrai reindirizzato al login...</p>}
    </div>
  );
};

export default ConfirmEmail;
