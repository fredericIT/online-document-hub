import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService';

// Reuse Link from react-router-dom
const ActionCard = ({ to, gradientFrom, gradientTo, bgGlow, icon, badge, title, description, cta }) => (
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
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(r => r.name === 'ROLE_ADMIN');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Hero ── */}
      <div className="relative glass-card-static mb-10 p-8 sm:p-10 overflow-visible">
        <div className="absolute inset-0 bg-grid opacity-30 rounded-[1.25rem] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-8 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">{greeting}</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
              Hi, <span className="text-gradient">{user?.username}</span> 👋
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
              <Link to="/documents" className="btn-ghost py-3 px-7">Browse documents</Link>
            </div>
          </div>
          <div className="hidden lg:block animate-float">
            <div className="w-32 h-32 rounded-3xl flex items-center justify-center animate-glow"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
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
    </div>
  );
};

export default Dashboard;