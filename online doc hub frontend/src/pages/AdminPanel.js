import React, { useState, useEffect } from 'react';
import {
  getUsers, deleteUser, enableUser, disableUser,
  getAuditLogs, getSettings, updateSetting,
  getAllShares, revokeShare
} from '../services/api';

/* ─── Reusable sub-components ─────────────────────────────────────── */

const StatCard = ({ icon, label, value, accent }) => (
  <div className="glass-card p-6 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="icon-box" style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p>
    </div>
    <p className="text-4xl font-extrabold text-white tracking-tight">{value}</p>
  </div>
);

/* ─── Main component ───────────────────────────────────────────────── */

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users,    setUsers]    = useState([]);
  const [logs,     setLogs]     = useState([]);
  const [settings, setSettings] = useState([]);
  const [shares,   setShares]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const stats = {
    totalUsers:  users.length,
    activeUsers: users.filter(u => u.enabled).length,
    adminUsers:  users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length,
    totalLogs:   logs.length,
    activeShares: shares.length,
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      if      (activeTab === 'users')    { setUsers(await getUsers()); }
      else if (activeTab === 'audit')    { setLogs(await getAuditLogs()); }
      else if (activeTab === 'settings') { setSettings(await getSettings()); }
      else if (activeTab === 'shares')   { setShares(await getAllShares()); }
    } catch { setError(`Failed to load ${activeTab}`); }
    finally { setLoading(false); }
  };

  const handleToggle = async (user) => {
    try {
      user.enabled ? await disableUser(user.id) : await enableUser(user.id);
      setSuccess(`User ${user.username} ${user.enabled ? 'disabled' : 'enabled'}`);
      loadData();
    } catch { setError('Failed to update user status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try { await deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); setSuccess('User deleted'); }
    catch { setError('Failed to delete user'); }
  };

  const handleUpdateSetting = async (id, value) => {
    try { await updateSetting(id, value); setSuccess('Setting saved'); loadData(); }
    catch { setError('Failed to save setting'); }
  };

  const handleRevokeShare = async (id) => {
    if (!window.confirm('Revoke this share?')) return;
    try { await revokeShare(id); setSuccess('Share revoked'); loadData(); }
    catch { setError('Failed to revoke share'); }
  };

  /* ── Loading state ── */
  if (loading && !users.length && !logs.length && !settings.length) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-slate-500 font-medium text-sm">Loading admin console…</p>
    </div>
  );

  /* ── Tabs config ── */
  const tabs = [
    { id: 'users',    label: 'User Management',  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'audit',    label: 'Audit Logs',       icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'settings', label: 'System Settings',  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg> },
    { id: 'shares',   label: 'Global Shares',    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> },
  ];

  /* ── Table head cell ── */
  const Th = ({ children, right }) => (
    <th className={`px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 ${right ? 'text-right' : 'text-left'}`}>{children}</th>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">Administration</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            System <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-slate-500 text-base mt-2">Monitor activity and manage platform settings.</p>
        </div>
        <button onClick={loadData} className="btn-ghost flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} label="Total Users" value={stats.totalUsers} accent="#6366f1" />
        <StatCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Active" value={stats.activeUsers} accent="#22d3ee" />
        <StatCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} label="Admins" value={stats.adminUsers} accent="#f59e0b" />
        <StatCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Log Entries" value={stats.totalLogs} accent="#ef4444" />
        <StatCard icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>} label="Shares" value={stats.activeShares} accent="#a78bfa" />
      </div>

      {/* ── Alerts ── */}
      {error   && <div className="alert-error mb-5"><svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{error}</div>}
      {success && <div className="alert-success mb-5"><svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{success}</div>}

      {/* ── Tab bar ── */}
      <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={activeTab === t.id
              ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }
              : { color: 'rgba(148,163,184,1)', background: 'transparent' }
            }>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Content panel ── */}
      <div className="glass-card-static overflow-hidden">

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <tr><Th>Identity</Th><Th>Role</Th><Th>Status</Th><Th right>Actions</Th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          {u.profileImage
                            ? <img src={`http://localhost:8081${u.profileImage}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                            : u.username.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{u.username}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles && [...new Set(u.roles.map(r => r.name))].map(r => (
                          <span key={r} className={r.includes('ADMIN') ? 'badge badge-red' : 'badge badge-indigo'}>
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${u.enabled
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggle(u)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${u.enabled
                            ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                          {u.enabled ? 'Revoke' : 'Enable'}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="btn-danger px-3 py-1.5 text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="4" className="px-4 py-16 text-center text-slate-600 text-sm">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit logs tab */}
        {activeTab === 'audit' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title">Security Logs</h3>
              <span className="text-xs text-slate-600 font-medium">Last {logs.length} entries</span>
            </div>
            {logs.length === 0 ? (
              <div className="text-center py-20 text-slate-600 text-sm">No security events found.</div>
            ) : (
              <div className="space-y-2">
                {[...logs].reverse().map(log => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl px-4 py-3.5 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-[10px] text-slate-600 font-mono w-28 shrink-0">
                      {new Date(log.timestamp).toLocaleDateString()}<br />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <p className="text-sm font-semibold text-white w-32 shrink-0 truncate">{log.username}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                      {log.action}
                    </span>
                    <p className="text-sm text-slate-400 flex-1 truncate">{log.details}</p>
                    <p className="text-[10px] text-slate-600 font-mono shrink-0">{log.ipAddress || 'Internal'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="section-title mb-6">Configuration Parameters</h3>
            {settings.length === 0 ? (
              <div className="text-center py-20 text-slate-600 text-sm">No configurable parameters found.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {settings.map(s => (
                  <div key={s.id} className="rounded-2xl p-6 transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="icon-box" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{s.configKey}</p>
                        <p className="text-xs text-slate-500">{s.description}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Value</label>
                      <input type="text" defaultValue={s.configValue}
                        onBlur={e => handleUpdateSetting(s.id, e.target.value)}
                        className="input-field text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shares tab */}
        {activeTab === 'shares' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <tr><Th>Document</Th><Th>Shared By</Th><Th>Recipient</Th><Th>Permission</Th><Th right>Action</Th></tr>
              </thead>
              <tbody>
                {shares.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-16 text-center text-slate-600 text-sm">No active shares found.</td></tr>
                ) : shares.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < shares.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="icon-box shrink-0" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-white truncate max-w-[160px]">{s.document.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5"><p className="text-sm text-slate-300">{s.sharedBy.username}</p></td>
                    <td className="px-4 py-5"><p className="text-sm text-slate-300">{s.sharedWithUser.username}</p></td>
                    <td className="px-4 py-5">
                      <span className={`badge ${s.permission === 'ADMIN' ? 'badge-red' : s.permission === 'READ_WRITE' ? 'badge-indigo' : 'badge-cyan'}`}>
                        {s.permission.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button onClick={() => handleRevokeShare(s.id)} className="btn-danger px-3 py-1.5 text-xs">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;