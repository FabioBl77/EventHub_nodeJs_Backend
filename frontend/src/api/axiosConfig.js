import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔗 backend locale
  withCredentials: true, // serve se usi cookie di sessione
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/*
⚠️ Quando deployeremo su Render:
- sostituirai 'http://localhost:5000' con l’URL pubblico del backend (es. https://eventhub-backend.onrender.com)
*/
