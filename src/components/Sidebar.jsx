<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Get initials from full name
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // Role-based menu items
    const getMenuItems = () => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard', disabled: false },
                    { name: 'Donate Food', icon: '🍱', path: '/donate-food', disabled: false },
                    { name: 'My Donations', icon: '📦', path: '/my-donations', disabled: false },
                    { name: 'Live Map', icon: '🗺️', path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications', disabled: false },
                    { name: 'Impact', icon: '📈', path: '/impact', disabled: true },
                    { name: 'Profile', icon: '👤', path: '/profile', disabled: false }
                ];

            case 'ngo':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard', disabled: false },
                    { name: 'Available Food', icon: '🍱', path: '/available-food', disabled: false },
                    { name: 'My Requests', icon: '📦', path: '/my-requests', disabled: false },
                    { name: 'Live Map', icon: '🗺️', path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications', disabled: false },
                    { name: 'Impact', icon: '📈', path: '/impact', disabled: true },
                    { name: 'Profile', icon: '👤', path: '/profile', disabled: false }
                ];

            case 'volunteer':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard', disabled: false },
                    { name: 'Assignments', icon: '📝', path: '/assignments', disabled: false },
                    { name: 'My Pickups', icon: '🛵', path: '/my-pickups', disabled: false },
                    { name: 'Availability', icon: '⏰', path: '/availability', disabled: false },
                    { name: 'Live Map', icon: '🗺️', path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications', disabled: false },
                    { name: 'Impact', icon: '📈', path: '/impact', disabled: true },
                    { name: 'Profile', icon: '👤', path: '/profile', disabled: false }
                ];

            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-header">
                <div className="logo-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="logo-text">
                    <h2>FoodShare</h2>
                    <p>Redistribution Platform</p>
                </div>
            </div>

            {/* User Info */}
            <div className="user-info">
                <div className="user-avatar">
                    {getInitials(user?.fullName)}
                </div>
                <div className="user-details">
                    <h3>{user?.fullName || 'User'}</h3>
                    <p className="user-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Role'}</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    item.disabled ? (
                        <div key={index} className="nav-item disabled">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </div>
                    ) : (
                        <Link key={index} to={item.path} className="nav-item active">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </Link>
                    )
                ))}
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span>
                    <span className="nav-text">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
=======
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, UtensilsCrossed, Package, MapPin, Bell, TrendingUp, User,
    ShoppingBag, ClipboardList, Truck, Clock, Users, Handshake, Building2, Bike,
    Shield, LogOut, ChevronRight
} from 'lucide-react';

const Sidebar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        return names.length >= 2
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : name[0].toUpperCase();
    };

    const getMenuItems = () => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Donate Food', icon: UtensilsCrossed, path: '/donate-food' },
                    { name: 'My Donations', icon: Package, path: '/my-donations' },
                    { name: 'Live Map', icon: MapPin, path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: Bell, path: '/notifications', disabled: true },
                    { name: 'Impact', icon: TrendingUp, path: '/impact', disabled: true },
                    { name: 'Profile', icon: User, path: '/profile' },
                ];
            case 'ngo':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Available Food', icon: ShoppingBag, path: '/available-food' },
                    { name: 'My Requests', icon: ClipboardList, path: '/my-requests' },
                    { name: 'Live Map', icon: MapPin, path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: Bell, path: '/notifications', disabled: true },
                    { name: 'Impact', icon: TrendingUp, path: '/impact', disabled: true },
                    { name: 'Profile', icon: User, path: '/profile' },
                ];
            case 'volunteer':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                    { name: 'Assignments', icon: ClipboardList, path: '/assignments' },
                    { name: 'My Pickups', icon: Truck, path: '/my-pickups' },
                    { name: 'Availability', icon: Clock, path: '/availability' },
                    { name: 'Live Map', icon: MapPin, path: '/live-map', disabled: true },
                    { name: 'Notifications', icon: Bell, path: '/notifications', disabled: true },
                    { name: 'Impact', icon: TrendingUp, path: '/impact', disabled: true },
                    { name: 'Profile', icon: User, path: '/profile' },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
                    { name: 'All Users', icon: Users, path: '/admin/users' },
                    { name: 'Donors', icon: Handshake, path: '/admin/users?role=donor' },
                    { name: 'NGOs', icon: Building2, path: '/admin/users?role=ngo' },
                    { name: 'Volunteers', icon: Bike, path: '/admin/users?role=volunteer' },
                    { name: 'Donations', icon: Package, path: '/admin/donations', disabled: true },
                    { name: 'Assignments', icon: Truck, path: '/admin/assignments', disabled: true },
                ];
            default:
                return [];
        }
    };

    const isActive = (path) => {
        if (path.includes('?')) {
            return location.pathname + location.search === path;
        }
        // For paths without query params, only match if URL also has no query params
        return location.pathname === path && !location.search;
    };

    const menuItems = getMenuItems();

    return (
        <div className="fixed left-0 top-0 w-[272px] h-screen bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 border-r border-emerald-800/30 flex flex-col z-[900] overflow-hidden">
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <UtensilsCrossed size={20} />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-white leading-tight tracking-tight">FoodShare</h2>
                        <p className="text-[11px] text-emerald-300/70 font-medium">Redistribution Platform</p>
                    </div>
                </div>
            </div>

            {/* User Card */}
            <div className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-white/[0.07] border border-white/[0.08] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
                        {getInitials(user?.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{user?.fullName || 'User'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {user?.role === 'admin' && <Shield size={11} className="text-violet-400" />}
                            <span className="text-[11px] text-emerald-300/80 capitalize font-medium">{user?.role || 'Role'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5 scrollbar-thin">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    if (item.disabled) {
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/25 cursor-not-allowed select-none"
                            >
                                <Icon size={18} />
                                <span className="text-[13px] font-medium">{item.name}</span>
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                active
                                    ? 'bg-emerald-500/20 text-white border border-emerald-500/30 shadow-sm'
                                    : 'text-white/70 hover:text-white hover:bg-white/[0.08] border border-transparent'
                            }`}
                        >
                            <Icon size={18} className={active ? 'text-emerald-400' : 'text-white/50 group-hover:text-white/80'} />
                            <span className="text-[13px] font-medium flex-1">{item.name}</span>
                            {active && <ChevronRight size={14} className="text-emerald-400/60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-4 pt-2 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="text-[13px] font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
>>>>>>> d9f179565dedd4fc43489aaf77c6eea62967c2ca
