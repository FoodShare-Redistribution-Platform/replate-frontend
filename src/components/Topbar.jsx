<<<<<<< HEAD
import React from 'react';
import './Topbar.css';

const Topbar = ({ user }) => {
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setUnreadCount(data.count);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <div className="topbar">
            {/* Right Section */}
            <div className="topbar-right">
                {/* Theme Toggle */}
                <button className="icon-btn" title="Toggle Theme">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                </button>

                {/* Language Selector */}
                <button className="icon-btn" title="Language">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                </button>

                {/* Notifications */}
                <button
                    className="icon-btn notification-btn"
                    title="Notifications"
                    onClick={() => window.location.href = '/notifications'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                </button>

                {/* User Avatar */}
                <div className="user-avatar-container" onClick={() => window.location.href = '/profile'} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar-small">
                        {getInitials(user?.fullName)}
                    </div>
                    <div className="user-info-small">
                        <span className="user-name-small">{user?.fullName || 'User'}</span>
                        <span className="user-role-small">{user?.role || 'Role'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Globe, Bell, Search } from 'lucide-react';

const Topbar = ({ user }) => {
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        return names.length >= 2
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : name[0].toUpperCase();
    };

    return (
        <div className="sticky top-0 z-[800] h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6">
            {/* Search */}
            <div className="relative max-w-md flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
                <button
                    className="p-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
                    title="Toggle Theme"
                >
                    <Sun size={18} />
                </button>
                <button
                    className="p-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
                    title="Language"
                >
                    <Globe size={18} />
                </button>
                <button
                    className="relative p-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
                    title="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
                </button>

                <div className="w-px h-8 bg-slate-800 mx-2"></div>

                {/* User Avatar */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-all"
                >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user?.fullName)}
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-[13px] font-medium text-slate-200 leading-tight">{user?.fullName || 'User'}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{user?.role || 'Role'}</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Topbar;
>>>>>>> d9f179565dedd4fc43489aaf77c6eea62967c2ca
