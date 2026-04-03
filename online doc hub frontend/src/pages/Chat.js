import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getConversation, sendMessage, getUsers, downloadMessageAttachment } from '../services/api';
import { useAuth } from '../services/authService';
import { format, formatDistanceToNow } from 'date-fns';

const Chat = () => {
    const [users, setUsers]               = useState([]);
    const [searchQuery, setSearchQuery]   = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages]         = useState([]);
    const [newMessage, setNewMessage]     = useState('');
    const [file, setFile]                 = useState(null);
    const [loading, setLoading]           = useState(false);
    const { user: currentUser }           = useAuth();
    const location                        = useLocation();
    const navigate                        = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const messagesEndRef                  = useRef(null);
    const fileInputRef                    = useRef(null);

    const urlUsername = searchParams.get('user');

    /* ── Data loading ─────────────────────────────────────────── */
    useEffect(() => {
        loadUsers();
        const iv = setInterval(loadUsers, 20000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        if (users.length > 0 && urlUsername) {
            const u = users.find(u => u.username === urlUsername);
            if (u) setSelectedUser(u);
        } else if (!urlUsername) {
            setSelectedUser(null);
        }
    }, [urlUsername, users]);

    useEffect(() => {
        if (selectedUser) {
            loadConversation(selectedUser.id);
            const iv = setInterval(() => loadConversation(selectedUser.id), 5000);
            return () => clearInterval(iv);
        }
    }, [selectedUser]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.filter(u => u.id !== currentUser.id));
        } catch (e) { console.error('Failed to load users', e); }
    };

    const loadConversation = async (userId) => {
        try { setMessages(await getConversation(userId)); }
        catch (e) { console.error('Failed to load conversation', e); }
    };

    const isOnline = (lastSeen) => lastSeen && (new Date() - new Date(lastSeen)) < 60000;

    const handleDownload = async (msg) => {
        try {
            const blob = await downloadMessageAttachment(msg.id);
            const url  = window.URL.createObjectURL(new Blob([blob]));
            const a    = document.createElement('a');
            a.href = url; a.setAttribute('download', msg.fileName);
            document.body.appendChild(a); a.click(); a.parentNode.removeChild(a);
        } catch (e) { console.error('Download failed', e); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !file) || !selectedUser) return;
        try {
            setLoading(true);
            await sendMessage(selectedUser.id, newMessage, file);
            setNewMessage(''); setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            loadConversation(selectedUser.id);
        } catch (e) { console.error('Failed to send message', e); }
        finally { setLoading(false); }
    };

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Avatar helper ───────────────────────────────────────── */
    const Avatar = ({ user, size = 'md' }) => {
        const dim = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
        return (
            <div className={`${dim} rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0`}
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {user.profileImage
                    ? <img src={`http://localhost:8081${user.profileImage}`} alt="" className="w-full h-full object-cover" />
                    : <span className={size === 'lg' ? 'text-sm' : 'text-xs'}>{user.username.charAt(0).toUpperCase()}</span>
                }
            </div>
        );
    };

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex h-[calc(100vh-140px)] rounded-[1.25rem] overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0,0,0,0.35)' }}>

                {/* ── Sidebar ────────────────────────────────────────── */}
                <div className="w-80 flex flex-col shrink-0"
                    style={{ background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

                    {/* Sidebar header */}
                    <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <h2 className="text-lg font-bold text-white mb-0.5">Messages</h2>
                        <p className="text-xs text-slate-500">Chat with your teammates</p>
                        <div className="relative mt-4">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search users…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-200 rounded-xl outline-none transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                                onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    {/* User list */}
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 p-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                                </svg>
                                <p className="text-xs text-center">No users found</p>
                            </div>
                        ) : filtered.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setSearchParams({ user: u.username })}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
                                style={{
                                    background: selectedUser?.id === u.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                                    borderLeft: selectedUser?.id === u.id ? '3px solid #6366f1' : '3px solid transparent',
                                }}
                                onMouseEnter={e => { if (selectedUser?.id !== u.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                onMouseLeave={e => { if (selectedUser?.id !== u.id) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div className="relative">
                                    <Avatar user={u} size="lg" />
                                    {isOnline(u.lastSeen) && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2"
                                            style={{ borderColor: '#04060b' }} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-white truncate">{u.username}</p>
                                        {isOnline(u.lastSeen)
                                            ? <span className="text-[10px] text-emerald-400 font-medium shrink-0">Online</span>
                                            : <span className="text-[10px] text-slate-600 shrink-0">
                                                {u.lastSeen ? formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true }) : 'Never'}
                                              </span>
                                        }
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Chat area ──────────────────────────────────────── */}
                <div className="flex-1 flex flex-col" style={{ background: 'rgba(255,255,255,0.015)' }}>
                    {selectedUser ? (
                        <>
                            {/* Chat header */}
                            <div className="px-6 py-4 flex items-center gap-3"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                                <div className="relative">
                                    <Avatar user={selectedUser} size="lg" />
                                    {isOnline(selectedUser.lastSeen) && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2"
                                            style={{ borderColor: '#080b14' }} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white">{selectedUser.firstName
                                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                                        : selectedUser.username}
                                    </h2>
                                    {isOnline(selectedUser.lastSeen)
                                        ? <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                            Active now
                                          </span>
                                        : <span className="text-xs text-slate-500">
                                            Last seen {selectedUser.lastSeen
                                                ? formatDistanceToNow(new Date(selectedUser.lastSeen), { addSuffix: true })
                                                : 'never'}
                                          </span>
                                    }
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{
                                backgroundImage: `radial-gradient(rgba(99,102,241,0.03) 1px, transparent 1px)`,
                                backgroundSize: '28px 28px',
                            }}>
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">No messages yet</p>
                                        <p className="text-xs">Say hello to start the conversation!</p>
                                    </div>
                                )}

                                {messages.map((msg, idx) => {
                                    const isMine = msg.senderId === currentUser.id;
                                    return (
                                        <div key={idx} className={`flex gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            {!isMine && <Avatar user={selectedUser} />}
                                            <div className="max-w-[65%]">
                                                <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                                                    style={isMine ? {
                                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                        color: '#fff',
                                                        borderBottomRightRadius: '0.375rem',
                                                        boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                                                    } : {
                                                        background: 'rgba(255,255,255,0.07)',
                                                        border: '1px solid rgba(255,255,255,0.09)',
                                                        color: '#e2e8f0',
                                                        borderBottomLeftRadius: '0.375rem',
                                                    }}>
                                                    {msg.content && <p>{msg.content}</p>}
                                                    {msg.fileName && (
                                                        <button onClick={() => handleDownload(msg)}
                                                            className="mt-2 flex items-center gap-2.5 rounded-xl p-3 w-full text-left transition-all"
                                                            style={isMine
                                                                ? { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }
                                                                : { background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.2)' }
                                                            }>
                                                            <div className="p-1.5 rounded-lg shrink-0"
                                                                style={isMine ? { background: 'rgba(255,255,255,0.15)' } : { background: 'rgba(99,102,241,0.15)' }}>
                                                                <svg className="w-4 h-4" style={{ color: isMine ? '#fff' : '#a5b4fc' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-semibold truncate">{msg.fileName}</p>
                                                                <p className="text-[10px] opacity-60">{(msg.fileSize / 1024).toFixed(1)} KB · Click to download</p>
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={`text-[10px] mt-1.5 text-slate-600 ${isMine ? 'text-right' : 'text-left'}`}>
                                                    {format(new Date(msg.sentAt), 'HH:mm')}
                                                </p>
                                            </div>
                                            {isMine && <Avatar user={currentUser} />}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input bar */}
                            <form onSubmit={handleSend} className="p-4"
                                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                {file && (
                                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl text-xs max-w-fit"
                                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="truncate max-w-[180px]">{file.name}</span>
                                        <button type="button" onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
                                            className="ml-1 text-slate-400 hover:text-rose-400 transition-colors font-bold">×</button>
                                    </div>
                                )}
                                <div className="flex items-end gap-2 rounded-2xl p-2"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                                    {/* Attach */}
                                    <button type="button" onClick={() => fileInputRef.current.click()}
                                        className="p-2.5 rounded-xl text-slate-500 transition-all hover:text-indigo-400"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={e => setFile(e.target.files[0])} />

                                    {/* Text input */}
                                    <textarea
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Type a message…"
                                        rows={1}
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-600 resize-none max-h-32 py-2"
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                                    />

                                    {/* Send */}
                                    <button type="submit" disabled={loading || (!newMessage.trim() && !file)}
                                        className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Empty state */
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-600"
                            style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Select a conversation</h3>
                            <p className="text-sm text-center max-w-xs">Pick a user from the list on the left to start messaging and sharing files.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
