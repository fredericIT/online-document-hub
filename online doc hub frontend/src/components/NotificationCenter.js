import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) loadNotifications();
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]); // eslint-disable-line

  const loadNotifications = async () => {
    try { setLoading(true); setNotifications(await getNotifications()); }
    catch {} finally { setLoading(false); }
  };

  const handleMarkRead = async (n) => {
    try {
      if (!n.isRead) { await markNotificationRead(n.id); setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x)); }
      if (n.link) { navigate(n.link); onClose(); }
    } catch {}
  };

  const handleMarkAll = async () => {
    try { await markAllNotificationsRead(); setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); }
    catch {}
  };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-80 rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10,13,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="text-sm font-bold text-white">Notifications</h3>
        <button onClick={handleMarkAll} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Mark all read</button>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => {
            const getTypeStyle = (type) => {
              switch(type) {
                case 'ACCESS_REVOKED': return { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', dot: '#ef4444' };
                case 'ACCESS_GRANTED': return { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', dot: '#22c55e' };
                case 'ACCOUNT_CREATED': return { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', dot: '#a855f7' };
                case 'NEW_MESSAGE': return { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', dot: '#3b82f6' };
                default: return { bg: n.isRead ? 'transparent' : 'rgba(99,102,241,0.06)', border: 'rgba(255,255,255,0.05)', dot: !n.isRead ? '#6366f1' : 'rgba(255,255,255,0.15)' };
              }
            };
            const style = getTypeStyle(n.isRead ? null : n.type);
            return (
              <div key={n.id} onClick={() => handleMarkRead(n)}
                className="flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: !n.isRead ? style.bg : 'transparent' }}>
                <div className="shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: style.dot }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!n.isRead ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>{n.content}</p>
                  <p className="text-xs text-slate-600 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">All caught up!</p>
            <p className="text-xs text-slate-600 mt-1">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
