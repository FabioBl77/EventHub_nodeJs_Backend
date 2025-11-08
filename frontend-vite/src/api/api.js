// src/api/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; // replace on Render

const api = axios.create({
  baseURL,
  withCredentials: false, // usare true se usi cookie di sessione
});

// aggiunge token JWT se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

/*
NOTE:
- In produzione (Render) sostituire VITE_API_URL con l'URL del backend.
  Esempio .env: VITE_API_URL=https://eventhub-backend.onrender.com/api
*/
