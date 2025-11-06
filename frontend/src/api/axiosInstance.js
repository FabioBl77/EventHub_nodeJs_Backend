// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api', // ↔ in Render sostituire con URL del backend
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
});

// Attacca token JWT se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
