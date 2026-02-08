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
            case 'admin':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/admin', disabled: false },
                    { name: 'All Users', icon: '👥', path: '/admin/users', disabled: false },
                    { name: 'Donors', icon: '🤝', path: '/admin/users?role=donor', disabled: false },
                    { name: 'NGOs', icon: '🏢', path: '/admin/users?role=ngo', disabled: false },
                    { name: 'Volunteers', icon: '🚴', path: '/admin/users?role=volunteer', disabled: false },
                    { name: 'Donations', icon: '📦', path: '/admin/donations', disabled: true },
                    { name: 'Assignments', icon: '🚚', path: '/admin/assignments', disabled: true },
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
                        <Link key={index} to={item.path} className="nav-item">
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
