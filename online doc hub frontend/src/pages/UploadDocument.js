import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../services/documentService';

const UploadDocument = () => {
  const [formData, setFormData] = useState({ title: '', description: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const setFile = (f) => setFormData(p => ({ ...p, file: f }));

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) { setError('Please select a file.'); return; }
    setUploading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('file', formData.file);
      await uploadDocument(fd);
      setSuccess('Uploaded successfully! Redirecting...');
      setTimeout(() => navigate('/documents'), 1800);
    } catch { setError('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const fileSizeMB = formData.file ? (formData.file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-white transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Page title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Upload Document</h1>
          <p className="text-slate-500 text-sm mt-0.5">Add a new file to your secure repository</p>
        </div>
      </div>

      <div className="glass-card-static p-8">
        {error && <div className="alert-error mb-5">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </div>}
        {success && <div className="alert-success mb-5">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {success}
        </div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Title <span className="text-indigo-400">*</span>
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              className="input-field" placeholder="Give this document a clear title" required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description <span className="text-slate-600 text-xs font-normal">(optional)</span>
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              className="input-field" rows={3} placeholder="What is this document about?" />
          </div>

          {/* Drop zone */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              File <span className="text-indigo-400">*</span>
            </label>
            <label htmlFor="file-input"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="block cursor-pointer rounded-2xl p-8 text-center transition-all duration-200"
              style={{
                border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.1)'}`,
                background: dragOver ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
              }}>
              {formData.file ? (
                <div>
                  <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-white text-base">{formData.file.name}</p>
                  <p className="text-slate-500 text-sm mt-1">{fileSizeMB} MB · <span className="text-indigo-400 underline">Choose different</span></p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto w-12 h-12 text-slate-700 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-slate-300 text-sm font-medium">
                    <span className="text-indigo-400">Click to select</span> or drag & drop
                  </p>
                  <p className="text-slate-600 text-xs mt-1">All file types · Up to 50 MB</p>
                </div>
              )}
              <input id="file-input" type="file" className="sr-only" onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5" disabled={uploading}>
            {uploading ? (
              <><svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Uploading…</>
            ) : (
              <><svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Upload Document</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;