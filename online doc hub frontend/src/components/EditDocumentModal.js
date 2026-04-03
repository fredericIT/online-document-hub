import React, { useState, useEffect } from 'react';

const EditDocumentModal = ({ isOpen, onClose, onSave, editDoc }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editDoc) {
      setFormData({
        title: editDoc.title || '',
        description: editDoc.description || ''
      });
      setError('');
    }
  }, [editDoc, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // Create a copy of the document and just update the editable fields
      const updatedDocument = {
        ...editDoc,
        title: formData.title,
        description: formData.description
      };
      await onSave(updatedDocument);
      onClose();
    } catch (err) {
      setError('Failed to update document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-card w-full max-w-md relative z-10 transform transition-all shadow-2xl rounded-2xl overflow-hidden border border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-white">Edit Document</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="alert-error mb-5 text-sm p-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Title
              </label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Enter document title"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Description
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                className="input-field w-full resize-none min-h-[100px]"
                placeholder="Enter document description"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button 
                type="button" 
                onClick={onClose}
                className="btn-ghost px-4 py-2 text-sm font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary px-5 py-2 text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/25 relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDocumentModal;
