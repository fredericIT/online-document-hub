import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { updateUserDetails, uploadAvatar } from '../services/api';

// Reuse Link from react-router-dom
const ActionCard = ({ to, gradientFrom, gradientTo, icon, badge, title, description, cta }) => (
  <Link to={to} className="glass-card block p-7 cursor-pointer">
    <div className="flex items-start justify-between mb-5">
      <div className="icon-box" style={{ background: `linear-gradient(135deg, ${gradientFrom}22, ${gradientTo}11)`, border: `1px solid ${gradientFrom}44` }}>
        <span style={{ color: gradientFrom }}>{icon}</span>
      </div>
      {badge && <span className={badge.cls}>{badge.label}</span>}
    </div>
    <h3 className="text-[1.0625rem] font-bold text-white mb-1.5">{title}</h3>
    <p className="text-slate-400 text-[0.875rem] leading-relaxed mb-6">{description}</p>
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: gradientFrom }}>
      {cta}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  </Link>
);

const Dashboard = () => {
  const { user, updateUserData } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const isAdmin = user?.roles?.some(r => r.name === 'ROLE_ADMIN');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const updatedUser = await updateUserDetails(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username
      });
      updateUserData(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const updatedUser = await uploadAvatar(file);
      updateUserData(updatedUser);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload picture' });
    } finally {
      setAvatarLoading(false);
    }
  };

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* ── Profile Modal ── */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card-static w-full max-w-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
            
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {message.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                {message.text}
              </div>
            )}

            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-indigo-500/30 bg-slate-800 flex items-center justify-center shadow-2xl">
                  {avatarLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                  ) : user.profileImage ? (
                    <img src={`http://localhost:8081${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-300">{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-1 -right-1 bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-500 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium uppercase tracking-widest">Profile Picture</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <input type="text" value={formData.username} className="input-field opacity-60 cursor-not-allowed" disabled />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" required />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsProfileOpen(false)} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3 text-sm" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="relative glass-card-static mb-10 p-8 sm:p-10 overflow-visible">
        <div className="absolute inset-0 bg-grid opacity-30 rounded-[1.25rem] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-8 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">{greeting}</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
              Hi, <span className="text-gradient">{fullName}</span> 👋
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
              Your intelligent document workspace — upload, organise, and share with confidence.
            </p>
            <div className="mt-7 flex items-center gap-4 flex-wrap">
              <Link to="/upload" className="btn-primary py-3 px-7">
                <svg className="mr-2 w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload file
              </Link>
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="btn-ghost py-3 px-7 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Manage Profile
              </button>
            </div>
          </div>
          <div className="hidden lg:block animate-float">
            <div className="w-32 h-32 rounded-3xl flex items-center justify-center animate-glow relative group cursor-pointer overflow-hidden"
              onClick={() => setIsProfileOpen(true)}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user.profileImage ? (
                <img src={`http://localhost:8081${user.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <h2 className="section-title">Quick Actions</h2>
      <div className={`grid gap-5 mb-5 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <ActionCard
          to="/upload"
          gradientFrom="#6366f1" gradientTo="#8b5cf6"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
          badge={{ cls: 'badge badge-indigo', label: 'Secure' }}
          title="Upload Document"
          description="Securely upload files in any format — PDF, DOCX, XLSX and more — up to 50 MB each."
          cta="Upload now"
        />
        <ActionCard
          to="/documents"
          gradientFrom="#22d3ee" gradientTo="#06b6d4"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
          badge={{ cls: 'badge badge-cyan', label: 'All files' }}
          title="My Documents"
          description="Browse, search, download and manage all your uploaded documents from one place."
          cta="View all"
        />
        {isAdmin && (
          <ActionCard
            to="/admin"
            gradientFrom="#a78bfa" gradientTo="#8b5cf6"
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            badge={{ cls: 'badge badge-red', label: 'Admin' }}
            title="Admin Console"
            description="Manage users, view audit logs, adjust system settings, and oversee platform activity."
            cta="Open console"
          />
        )}
      </div>

      {/* ── Team Messaging ── */}
      <div className="glass-card p-6 flex items-center gap-5 mt-2">
        <div className="icon-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-[0.95rem]">Team Messaging</p>
          <p className="text-slate-400 text-sm mt-0.5">Send files, links, and messages to teammates in real time.</p>
        </div>
        <Link to="/chat" className="btn-primary py-2.5 px-5 text-sm shrink-0">Open Chat</Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </div>
 
 );
};

export default Dashboard;