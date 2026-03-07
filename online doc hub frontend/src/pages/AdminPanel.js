import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, enableUser, disableUser, getAuditLogs, getSettings, updateSetting, getAllShares, revokeShare } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Stats for the overview
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.enabled).length,
    adminUsers: users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length,
    totalLogs: logs.length,
    activeShares: shares.length
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const data = await getUsers();
        setUsers(data);
      } else if (activeTab === 'audit') {
        const data = await getAuditLogs();
        setLogs(data);
      } else if (activeTab === 'settings') {
        const data = await getSettings();
        setSettings(data);
      } else if (activeTab === 'shares') {
        const data = await getAllShares();
        setShares(data);
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (user.enabled) {
        await disableUser(user.id);
        setSuccess(`Disabled user ${user.username}`);
      } else {
        await enableUser(user.id);
        setSuccess(`Enabled user ${user.username}`);
      }
      loadData();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleUpdateSetting = async (id, value) => {
    try {
      await updateSetting(id, value);
      setSuccess('Setting updated successfully');
      loadData();
    } catch (err) {
      setError('Failed to update setting');
    }
  };

  const handleRevokeShare = async (shareId) => {
    if (window.confirm('Are you sure you want to revoke this share? The recipient will lose access.')) {
      try {
        await revokeShare(shareId);
        setSuccess('Share revoked successfully');
        loadData();
      } catch (err) {
        setError('Failed to revoke share');
      }
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-300 ${
        activeTab === id
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
          : 'border-transparent text-gray-500 hover:text-indigo-500 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading && users.length === 0 && logs.length === 0 && settings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Initializing Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Overview</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">Monitor activity and manage system parameters.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={loadData}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-gray-700 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.totalUsers}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</span>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.activeUsers}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-100 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admins</span>
          </div>
          <div className="text-3xl font-black text-amber-600">{stats.adminUsers}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-rose-100 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Logs</span>
          </div>
          <div className="text-3xl font-black text-rose-600">{stats.totalLogs}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-100 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Shares</span>
          </div>
          <div className="text-3xl font-black text-violet-600">{stats.activeShares}</div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
          <TabButton 
            id="users" 
            label="User Management" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <TabButton 
            id="audit" 
            label="Audit Logs" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <TabButton 
            id="settings" 
            label="System Settings" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg>}
          />
          <TabButton 
            id="shares" 
            label="Global Shares" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
          />
        </div>

        {/* Notifications */}
        <div className="px-6 py-4">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-center mb-4 transition-all animate-shake">
              <svg className="w-5 h-5 text-rose-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-rose-700 font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl flex items-center mb-4 transition-all animate-slideIn">
              <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-emerald-700 font-bold">{success}</p>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Identity</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Privileges</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-bold text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-400 font-medium">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles && Array.from(new Set(user.roles.map(r => r.name))).map(roleName => (
                            <span key={roleName} className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg border ${
                              roleName.includes('ADMIN') 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}>
                              {roleName.replace('ROLE', '').replace('_', ' ').trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          user.enabled 
                            ? 'bg-emerald-100/50 text-emerald-700 ring-1 ring-emerald-200' 
                            : 'bg-rose-100/50 text-rose-700 ring-1 ring-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.enabled ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                          {user.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all active:scale-95 ${
                            user.enabled 
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50' 
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {user.enabled ? 'Revoke Access' : 'Grant Access'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95"
                        >
                          Erase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-gray-800">Security Logs</h3>
                 <span className="text-xs font-bold text-gray-400">Past 50 entries</span>
               </div>
               <div className="space-y-4">
                 {logs.length === 0 ? (
                   <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold">No security events found.</p>
                   </div>
                 ) : (
                   logs.map((log) => (
                     <div key={log.id} className="flex flex-col sm:flex-row sm:items-center bg-gray-50/50 p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all group">
                       <div className="flex items-center space-x-4 mb-3 sm:mb-0 sm:w-1/4">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter w-24">
                           {new Date(log.timestamp).toLocaleDateString()}
                           <br />
                           {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                         <div className="font-bold text-gray-700 truncate">{log.username}</div>
                       </div>
                       <div className="flex-1 px-4">
                         <span className="inline-block px-3 py-1 text-[10px] font-black bg-white rounded-lg border border-gray-200 text-indigo-600 shadow-sm mr-4 mb-2 sm:mb-0 uppercase tracking-widest">
                           {log.action}
                         </span>
                         <span className="text-sm text-gray-500 font-medium">{log.details}</span>
                       </div>
                       <div className="mt-3 sm:mt-0 text-[10px] font-mono text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                         IP: {log.ipAddress || 'Internal'}
                       </div>
                     </div>
                   )).reverse()
                 )}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {settings.length === 0 ? (
                <div className="lg:col-span-2 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">No configurable parameters found.</p>
                </div>
              ) : (
                settings.map((setting) => (
                  <div key={setting.id} className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 hover:border-indigo-300 transition-all hover:shadow-lg group">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600 border border-gray-100 group-hover:rotate-6 transition-transform">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <div className="text-[10px] font-black text-gray-300 tracking-widest uppercase">Configuration</div>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{setting.configKey}</h4>
                      <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">{setting.description}</p>
                      
                      <div className="mt-auto">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Value</label>
                        <div className="relative group/input">
                         <input
                           type="text"
                           defaultValue={setting.configValue}
                           onBlur={(e) => handleUpdateSetting(setting.id, e.target.value)}
                           className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all pr-24"
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
                           Auto-Save
                         </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'shares' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Document</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Shared By</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Recipient</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Permissions</th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shares.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-20 text-center">
                        <p className="text-gray-400 font-bold">No active shares found globally.</p>
                      </td>
                    </tr>
                  ) : (
                    shares.map((share) => (
                      <tr key={share.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]" title={share.document.title}>{share.document.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-700">{share.sharedBy.username}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-700">{share.sharedWithUser.username}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg ${
                            share.permission === 'ADMIN' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            share.permission === 'READ_WRITE' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}>
                            {share.permission.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleRevokeShare(share.id)}
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default AdminPanel;