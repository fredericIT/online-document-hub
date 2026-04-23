import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { getUnreadCount, heartbeat } from '../services/api';
import NotificationCenter from './NotificationCenter';

const NavLink = ({ to, label, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-200 px-1 py-1 ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
      {label}
      <span className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${active ? 'w-full bg-gradient-to-r from-indigo-500 to-violet-500' : 'w-0 bg-indigo-500'}`} />
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try { setUnreadCount(await getUnreadCount()); } catch {}
    };
    const pulse = async () => {
      try { await heartbeat(); } catch {}
    };
    
    fetch();
    pulse();
    
    const t = setInterval(fetch, 15000);
    const h = setInterval(pulse, 30000);
    
    return () => {
      clearInterval(t);
      clearInterval(h);
    };
  }, [user]);

  return (
    <>
      <nav className="glass-nav" style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none', transition: 'box-shadow 0.3s ease' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
              <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gradient tracking-tight">DocHub</span>
          </Link>

          {/* Nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-7 mx-8">
              <NavLink to="/" label="Home" />
              <NavLink to="/documents" label="Documents" />
              <NavLink to="/upload" label="Upload" />
              <NavLink to="/chat" label="Messages" />
              {user.roles?.some(r => r.name === 'ROLE_ADMIN') && <NavLink to="/admin" label="Admin" />}
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Mobile menu toggle */}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center rounded-full"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                </div>

                {/* User chip */}
                <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-sm font-bold text-indigo-300"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    {user.profileImage ? (
                      <img src={`http://localhost:8081${user.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user.firstName ? user.firstName.charAt(0) : user.username.charAt(0)).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-200 hidden lg:block">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                  </span>
                </div>

                <button onClick={() => { logout(); navigate('/login'); }}
                  className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign in</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Join free</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden absolute top-[72px] left-0 w-full glass-nav flex flex-col px-6 py-4 gap-4 shadow-xl z-40 border-b border-white/10" style={{ background: '#0f172a' }}>
          <NavLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
          <NavLink to="/documents" label="Documents" onClick={() => setIsMobileMenuOpen(false)} />
          <NavLink to="/upload" label="Upload" onClick={() => setIsMobileMenuOpen(false)} />
          <NavLink to="/chat" label="Messages" onClick={() => setIsMobileMenuOpen(false)} />
          {user.roles?.some(r => r.name === 'ROLE_ADMIN') && <NavLink to="/admin" label="Admin" onClick={() => setIsMobileMenuOpen(false)} />}
        </div>
      )}
    </>
  );
};

export default Navbar;