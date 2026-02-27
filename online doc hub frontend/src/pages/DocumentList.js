import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../services/documentService';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        setDocuments(documents.filter(doc => doc.id !== documentId));
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading documents...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Documents</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {documents.length === 0 ? (
        <p>No documents found. Upload your first document!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              style={{ 
                padding: '1rem', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{doc.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>{doc.description}</p>
                  <small style={{ color: '#999' }}>
                    Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => window.open(`/api/documents/download/${doc.id}`, '_blank')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
