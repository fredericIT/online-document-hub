import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { getConversation, sendMessage, getUsers, downloadMessageAttachment } from '../services/api';

import { useAuth } from '../services/authService';
import { format, formatDistanceToNow } from 'date-fns';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useAuth();
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        loadUsers();
        const interval = setInterval(loadUsers, 20000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            const params = new URLSearchParams(location.search);
            const userId = params.get('user');
            if (userId) {
                const userToSelect = users.find(u => u.id === parseInt(userId));
                if (userToSelect) {
                    setSelectedUser(userToSelect);
                }
            }
        }
    }, [location.search, users]);


    useEffect(() => {
        if (selectedUser) {
            loadConversation(selectedUser.id);
            const interval = setInterval(() => loadConversation(selectedUser.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, location.search]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.filter(u => u.id !== currentUser.id));
            
            // If we have a query param, update selectedUser with latest data from list
            const params = new URLSearchParams(location.search);
            const userId = params.get('user');
            if (userId) {
                const refreshed = data.find(u => u.id === parseInt(userId));
                if (refreshed) setSelectedUser(refreshed);
            } else if (selectedUser) {
                const refreshed = data.find(u => u.id === selectedUser.id);
                if (refreshed) setSelectedUser(refreshed);
            }
        } catch (error) {
            console.error('Failed to load users', error);
        }
    };

    const isUserOnline = (lastSeen) => {
        if (!lastSeen) return false;
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        return (now - lastSeenDate) < 60000;
    };

    const loadConversation = async (userId) => {
        try {
            const data = await getConversation(userId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to load conversation', error);
        }
    };

    const handleDownload = async (msg) => {
        try {
            const blob = await downloadMessageAttachment(msg.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', msg.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
        }
    };


    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !file) || !selectedUser) return;

        try {
            setLoading(true);
            await sendMessage(selectedUser.id, newMessage, file);
            setNewMessage('');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            loadConversation(selectedUser.id);
        } catch (error) {
            console.error('Failed to send message', error);
        } finally {
            setLoading(false);
        }
    };

    const chatBackgroundStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='rgba(0,0,0,0.06)' stroke='rgba(0,0,0,0.06)' stroke-width='2' fill-opacity='0'%3E%3Ctext x='200' y='150' transform='rotate(-15 200 150)' font-family='system-ui, sans-serif' font-size='24' font-weight='800' fill='rgba(0,0,0,0.06)' stroke='none' text-anchor='middle' dominant-baseline='middle'%3EOnline Document Hub%3C/text%3E%3Cpath d='M60,240 h-20 a5,5 0 0,1 -5,-5 v-30 a5,5 0 0,1 5,-5 h15 l10,10 v25 a5,5 0 0,1 -5,5 z' stroke-linecap='round' stroke-linejoin='round' /%3E%3Cpath d='M300,50 h-20 a5,5 0 0,1 -5,-5 v-30 a5,5 0 0,1 5,-5 h15 l10,10 v25 a5,5 0 0,1 -5,5 z' stroke-linecap='round' stroke-linejoin='round' /%3E%3Cpath d='M340,140 a15,15 0 1,0 -30,0 v15 l10,-5 h15 a15,15 0 0,0 5,-10 z' stroke-linecap='round' stroke-linejoin='round' /%3E%3Cpath d='M100,100 c0,-10 15,-10 15,0 v20 c0,15 -20,15 -20,0 v-25 c0,-20 30,-20 30,0 v20' stroke-linecap='round' /%3E%3Ccircle cx='250' cy='260' r='6' /%3E%3Ccircle cx='80' cy='80' r='4' fill='rgba(0,0,0,0.06)' stroke='none' /%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '400px 300px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#efeae2'
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* User List */}
            <div className="w-1/3 border-r border-gray-100 bg-white overflow-y-auto">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    <p className="text-xs text-gray-400 mt-1">Chat with other system users</p>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                        <div 
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {user.profileImage ? (
                                        <img src={`http://localhost:8081${user.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {isUserOnline(user.lastSeen) && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                                    {user.username}
                                    {isUserOnline(user.lastSeen) ? (
                                        <span className="text-[10px] text-green-500 font-normal">Online</span>
                                    ) : (
                                        <span className="text-[10px] text-gray-400 font-normal">
                                            {user.lastSeen ? formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true }) : 'Never seen'}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {selectedUser.profileImage ? (
                                    <img src={`http://localhost:8081${selectedUser.profileImage}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    selectedUser.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h2 className="text-md font-bold text-gray-800">{selectedUser.username}</h2>
                                {isUserOnline(selectedUser.lastSeen) ? (
                                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-gray-400">
                                        Last seen {selectedUser.lastSeen ? formatDistanceToNow(new Date(selectedUser.lastSeen), { addSuffix: true }) : 'Never'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={chatBackgroundStyle}>
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                        msg.senderId === currentUser.id 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}
                                    >
                                        {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                                        {msg.fileName && (
                                            <div 
                                                onClick={() => handleDownload(msg)}
                                                className={`mt-2 p-3 rounded-xl border ${msg.senderId === currentUser.id ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100'} flex items-center gap-3 group transition-all cursor-pointer`}
                                            >

                                                <div className={`p-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-white/20' : 'bg-blue-100'}`}>
                                                    <svg className={`w-5 h-5 ${msg.senderId === currentUser.id ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">{msg.fileName}</p>
                                                    <p className={`text-[10px] ${msg.senderId === currentUser.id ? 'text-white/60' : 'text-gray-400'}`}>
                                                        {(msg.fileSize / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className={`text-[10px] mt-2 ${msg.senderId === currentUser.id ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                                            {format(new Date(msg.sentAt), 'HH:mm')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-300 transition-all shadow-inner">
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <div className="flex-1 flex flex-col">
                                    {file && (
                                        <div className="px-2 py-1 mb-1 text-[10px] bg-blue-100 text-blue-700 rounded-md inline-flex items-center gap-2 max-w-fit">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button type="button" onClick={() => setFile(null)} className="hover:text-red-500 font-bold">×</button>
                                        </div>
                                    )}
                                    <textarea 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 resize-none max-h-32 text-gray-900"
                                        rows="1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend(e);
                                            }
                                        }}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12" style={chatBackgroundStyle}>
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-gray-100">
                            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Select a conversation</h2>
                        <p className="text-sm mt-2 text-center max-w-xs">Pick a user from the list to start messaging and sharing files.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
