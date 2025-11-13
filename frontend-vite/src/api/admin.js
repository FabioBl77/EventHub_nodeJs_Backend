// src/api/admin.js
import api from "./api";

// ==============================
//      GESTIONE UTENTI
// ==============================

// Restituisce lista completa utenti
export const fetchAdminUsers = () => {
  return api.get("/admin/users");
};

// Dettagli singolo utente
export const fetchAdminUserDetails = (id) => {
  return api.get(`/admin/users/${id}`);
};

// Cambia ruolo (user/admin)
export const updateUserRole = (id, role) => {
  return api.put(`/admin/users/${id}/role`, { role });
};

// Blocca o sblocca utente
export const toggleUserBlock = (id) => {
  return api.put(`/admin/users/${id}/block`);
};

// Elimina utente
export const deleteUserByAdmin = (id) => {
  return api.delete(`/admin/users/${id}`);
};
