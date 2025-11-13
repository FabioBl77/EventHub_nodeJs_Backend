// src/pages/AdminDashboard.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Area Amministratore</h1>

      <p className="admin-welcome">
        Benvenuto nella tua area di amministrazione
        {user?.username ? `, ${user.username}` : ""}.
      </p>

      <div className="admin-sections">
        {/* Gestione utenti */}
        <div
          className="admin-card"
          onClick={() => navigate("/admin/users")}
          style={{ cursor: "pointer" }}
        >
          <h2>Gestione Utenti</h2>
          <p>Visualizza, modifica ruolo, blocca o elimina utenti.</p>
        </div>

        {/* Gestione eventi */}
        <div
          className="admin-card"
          onClick={() => navigate("/admin/events")}
          style={{ cursor: "pointer" }}
        >
          <h2>Gestione Eventi</h2>
          <p>Modera eventi, blocca o elimina contenuti non conformi.</p>
        </div>

        {/* Segnalazioni eventi */}
        <div
          className="admin-card"
          onClick={() => navigate("/admin/reports")}
          style={{ cursor: "pointer" }}
        >
          <h2>Segnalazioni</h2>
          <p>Controlla gli eventi segnalati dagli utenti.</p>
        </div>
      </div>
    </div>
  );
}
