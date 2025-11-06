// src/api/eventApi.js
import api from './axiosInstance';

export const getEvents = (params) => api.get('/events', { params }); // params: { category, date, location }
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const registerToEvent = (id) => api.post(`/events/${id}/register`);
export const cancelRegistration = (id) => api.delete(`/events/${id}/cancel`);
export const reportEvent = (id) => api.post(`/events/${id}/report`);
export const getDashboard = () => api.get('/events/dashboard');
export const filterEvents = (params) => api.get('/events/filter', { params });
