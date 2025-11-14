// src/pages/AdminReports.jsx
import { useEffect, useState } from "react";
import { fetchAdminReports, deleteAdminReport } from "../api/admin";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "../styles/AdminReports.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Carica tutte le segnalazioni
  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminReports();
      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Errore caricamento segnalazioni:", error);
      toast.error("Errore nel caricamento delle segnalazioni");
    } finally {
      setLoading(false);
    }
  };

  // Elimina segnalazione
  const handleDeleteReport = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questa segnalazione?")) return;
    try {
      await deleteAdminReport(id);
      toast.success("Segnalazione eliminata correttamente");
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Errore eliminazione segnalazione:", error);
      toast.error("Errore durante l'eliminazione della segnalazione");
    }
  };

  // Socket per aggiornamenti in tempo reale
  useEffect(() => {
    loadReports();

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("report_created", (newReport) => {
      toast.info(`Nuova segnalazione da ${newReport.user.username}`);
      setReports((prev) => [newReport, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="admin-reports-page">
      <h1 className="admin-reports-title">Gestione Segnalazioni</h1>

      {loading ? (
        <p>Caricamento segnalazioni...</p>
      ) : reports.length === 0 ? (
        <p>Nessuna segnalazione trovata.</p>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.event?.title || "Evento sconosciuto"}</h3>
                <span
                  className={`status-badge ${
                    report.event?.isBlocked ? "red" : "green"
                  }`}
                >
                  {report.event?.isBlocked ? "Evento bloccato" : "Evento attivo"}
                </span>
              </div>

              <p className="report-reason">
                <strong>Motivo:</strong> {report.reason}
              </p>

              <div className="report-meta">
                <p>
                  <strong>Segnalato da:</strong>{" "}
                  {report.user?.username || "Utente sconosciuto"}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>


              <div className="report-actions">
                <button
                  className="btn-chat"
                  onClick={() =>
                    navigate(`/admin/event-chat/${report.event?.id}`)
                  }
                >
                  Apri Chat Live
                </button>

                <button
                  className="btn-delete"
                  onClick={() => handleDeleteReport(report.id)}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
