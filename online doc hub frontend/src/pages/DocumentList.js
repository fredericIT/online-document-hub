import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../services/documentService';
import { useAuth } from '../services/authService';

const EXT_COLORS = {
  PDF:  { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   text: '#fca5a5' },
  DOCX: { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)',  text: '#a5b4fc' },
  DOC:  { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)',  text: '#a5b4fc' },
  XLSX: { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)',   text: '#86efac' },
  XLS:  { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)',   text: '#86efac' },
  TXT:  { bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.2)',  text: '#94a3b8' },
};

const extOf = (filename = '') => (filename.split('.').pop() || 'FILE').toUpperCase();
const colOf = (ext) => EXT_COLORS[ext] || { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#a5b4fc' };

const DocumentList = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const isAdmin = user?.roles?.some(r => r.name === 'ROLE_ADMIN');

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    try { setDocuments(await getDocuments()); }
    catch { setError('Failed to load documents'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try { await deleteDocument(id); setDocuments(d => d.filter(x => x.id !== id)); }
    catch { setError('Could not delete document'); }
  };

  const filtered = documents.filter(d =>
    [d.title, d.description].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{isAdmin ? 'Global Repository' : 'My Documents'}</h1>
          <p className="text-slate-500 text-sm mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/upload" className="btn-primary shrink-0">
          <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search documents..." className="input-field has-icon w-full" />
      </div>

      {error && <div className="alert-error mb-6">
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {error}
      </div>}

      {filtered.length === 0 ? (
        <div className="glass-card-static text-center py-24">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{search ? `No results for "${search}"` : 'No documents yet'}</h3>
          <p className="text-slate-500 text-sm mb-8">{search ? 'Try a different search term.' : 'Upload your first document to get started.'}</p>
          {!search && <Link to="/upload" className="btn-primary inline-flex">Upload Document</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(doc => {
            const ext = extOf(doc.fileName || doc.title);
            const col = colOf(ext);
            return (
              <div key={doc.id} className="glass-card flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: col.bg, border: `1px solid ${col.border}` }}>
                      <svg className="w-5.5 h-5.5" style={{ color: col.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>
                      {ext}
                    </span>
                  </div>
                  <h4 className="text-[0.9375rem] font-bold text-white truncate mb-1">{doc.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4" style={{ minHeight: '2.5rem' }}>
                    {doc.description || 'No description provided.'}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(doc.uploadDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="px-5 py-3.5 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => window.open(`/api/documents/download/${doc.id}`, '_blank')}
                    className="btn-ghost flex-1 text-sm py-2">
                    <svg className="mr-1.5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="btn-danger px-3 py-2" title="Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentList;