import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Management
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const enableUser = async (id) => {
  const response = await api.put(`/users/${id}/enable`);
  return response.data;
};

export const disableUser = async (id) => {
  const response = await api.put(`/users/${id}/disable`);
  return response.data;
};

// Admin Features
export const getAuditLogs = async () => {
  const response = await api.get('/admin/audit');
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSetting = async (id, value) => {
  const response = await api.put(`/admin/settings/${id}`, { configValue: value });
  return response.data;
};

export default api;