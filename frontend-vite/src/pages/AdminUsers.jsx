// src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import {
  fetchAdminUsers,
  updateUserRole,
  toggleUserBlock,
  deleteUserByAdmin,
} from "../api/admin";
import { toast } from "react-toastify";
import "../styles/AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminUsers();
      setUsers(res.data);
    } catch {
      toast.error("Errore nel caricamento utenti");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users-page">
      <h1 className="admin-users-title">Gestione Utenti</h1>

      {loading ? (
        <p className="loading">Caricamento utenti...</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utente</th>
                <th>Ruolo</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>

                  <td className="user-info">
                    <div className="avatar">{u.username[0].toUpperCase()}</div>
                    <div>
                      <strong>{u.username}</strong>
                      <p className="email">{u.email}</p>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge-role ${
                        u.role === "admin" ? "admin" : "user"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge-status ${
                        u.isBlocked ? "blocked" : "active"
                      }`}
                    >
                      {u.isBlocked ? "Bloccato" : "Attivo"}
                    </span>
                  </td>

                  <td className="actions">
                    <button
                      className="btn primary"
                      onClick={() =>
                        updateUserRole(
                          u.id,
                          u.role === "admin" ? "user" : "admin"
                        ).then(loadUsers)
                      }
                    >
                      {u.role === "admin" ? "Rendi User" : "Rendi Admin"}
                    </button>

                    <button
                      className="btn warning"
                      onClick={() => toggleUserBlock(u.id).then(loadUsers)}
                    >
                      {u.isBlocked ? "Sblocca" : "Blocca"}
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => {
                        if (
                          window.confirm("Vuoi eliminare questo utente?")
                        ) {
                          deleteUserByAdmin(u.id).then(loadUsers);
                        }
                      }}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
