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
