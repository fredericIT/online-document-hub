import api from './api';

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (documentId) => {
  await api.delete(`/documents/${documentId}`);
};

export const downloadDocument = async (documentId) => {
  const response = await api.get(`/documents/download/${documentId}`, {
    responseType: 'blob',
  });
  return response.data;
};
