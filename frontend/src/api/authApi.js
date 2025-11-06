// src/api/authApi.js
import api from './axiosInstance';

export const register = (data) => api.post('/auth/register', data);
export const confirmEmail = (token) => api.get(`/auth/confirm-email/${token}`);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);
