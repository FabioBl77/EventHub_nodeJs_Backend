// src/api/api.js
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // replace on Render

const api = axios.create({
  baseURL,
  withCredentials: false, // usare true se usi cookie di sessione
});

// 🔹 Aggiunge token JWT a ogni richiesta se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Intercetta le risposte per gestire errori globali (token scaduto, ecc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se il token JWT è scaduto o non valido
    if (error.response?.status === 401) {
      alert("⚠️ Sessione scaduta. Effettua di nuovo il login.");

      // Rimuove token e dati utente locali
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Reindirizza al login
      window.location.href = "/login";
    }

    // Se il backend restituisce un messaggio specifico
    if (error.response?.data?.message) {
      console.error("Errore API:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;

/*
NOTE:
- In produzione (Render) sostituire VITE_API_URL con l'URL del backend.
  Esempio .env: VITE_API_URL=https://eventhub-backend.onrender.com/api
*/
