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

// ==============================
//      GESTIONE EVENTI ADMIN
// ==============================

// Ottieni tutti gli eventi
export const fetchAdminEvents = () => {
  return api.get("/admin/events");
};

// Blocca/sblocca un evento
export const blockEventByAdmin = (id) => {
  return api.put(`/admin/events/${id}/block`);
};

// Elimina evento
export const deleteEventByAdmin = (id) => {
  return api.delete(`/admin/events/${id}`);
};
// ==============================
//      GESTIONE SEGNALAZIONI
// ==============================

// Ottiene tutte le segnalazioni
export const fetchAdminReports = () => {
  return api.get("/admin/reports");
};
// Elimina una segnalazione
export const deleteAdminReport = (id) => {
  return api.delete(`/admin/reports/${id}`);
};

