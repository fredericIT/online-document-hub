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
    // When sending FormData, let axios set the Content-Type automatically
    // (it needs to include the multipart boundary — setting it manually breaks uploads)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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

export const updateUserDetails = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
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

// Share Management
export const getAllShares = async () => {
  const response = await api.get('/document-shares/all');
  return response.data;
};

export const revokeShare = async (id) => {
  const response = await api.put(`/document-shares/${id}/revoke`);
  return response.data;
};

// Messaging
export const sendMessage = async (recipientId, content, file) => {
    const formData = new FormData();
    formData.append('recipientId', recipientId);
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);
    
    const response = await api.post('/messages/send', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getConversation = async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
};

// Notifications
export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const getUnreadNotifications = async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
};

export const downloadMessageAttachment = async (messageId) => {
    const response = await api.get(`/messages/attachment/${messageId}`, {
        responseType: 'blob'
    });
    return response.data;
};

// Auth
export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify?token=${token}`);
  return response.data;
};

export const heartbeat = async () => {
    const response = await api.post('/auth/heartbeat');
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/auth/upload-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
};

export default api;