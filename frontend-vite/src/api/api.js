import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // 🔗 backend
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/*
📘 NOTE:
- Durante lo sviluppo locale, .env contiene:
    VITE_API_URL=http://localhost:3000
- Quando deployerai su Render o simili:
    VITE_API_URL=https://eventhub-backend.onrender.com
*/
