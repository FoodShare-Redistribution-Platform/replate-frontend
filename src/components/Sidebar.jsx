import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import './Sidebar.css';

const Sidebar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = React.useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);

    const handleLiveMapClick = React.useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                "http://localhost:5001/api/assignments/volunteer-active",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (!res.ok) return;
            const assignment = await res.json();
            navigate(`/live-map/${assignment._id}`);
        } catch (err) {
            console.error(err);
        }
    }, [navigate]);

    const handleTrackingClick = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://localhost:5001/api/assignments/volunteer-active",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (!res.ok) {
            alert("No active delivery");
            return;
        }

        const assignment = await res.json();

        navigate(`/tracking/${assignment._id}`);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const getMenuItems = React.useCallback(() => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: 'Dashboard', enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Donate Food', enName: 'donate food', icon: '🍱', path: '/donate-food' },
                    { name: 'My Donations', enName: 'my donations', icon: '📦', path: '/my-donations' },
                    { name: 'Live Map', enName: 'live map', icon: '🗺️', isTracking: true },
                    { name: 'Notifications', enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'ngo':
                return [
                    { name: 'Dashboard', enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Available Food', enName: 'available food', icon: '🍱', path: '/available-food' },
                    { name: 'My Requests', enName: 'my requests', icon: '📦', path: '/my-requests' },
                    { name: 'Live Map', enName: 'live map', icon: '🗺️', isTracking: true },
                    { name: 'Notifications', enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'volunteer':
                return [
                    { name: 'Dashboard', enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Assignments', enName: 'assignments', icon: '📝', path: '/assignments' },
                    { name: 'My Pickups', enName: 'my pickups', icon: '🛵', path: '/my-pickups' },
                    { name: 'Availability', enName: 'availability', icon: '⏰', path: '/availability' },
                    { name: 'Live Map', enName: 'live map', icon: '🗺️', isLiveMap: true },
                    { name: 'Notifications', enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', enName: 'dashboard', icon: '📊', path: '/admin' },
                    { name: 'Fleet Map', enName: 'fleet map', icon: '🗺️', path: '/admin/live-map' },
                    { name: 'Impact', enName: 'impact', icon: '📈', path: '/impact' },
                    { name: 'Users', enName: 'users', icon: '👥', path: '/admin/users' },
                    { name: 'Donations', enName: 'donations', icon: '🍱', path: '/admin/food' },
                    { name: 'Assignments', enName: 'assignments', icon: '📝', path: '/admin/assignments' },
                    { name: 'Analytics', enName: 'analytics', icon: '📉', path: '/admin/analytics' }
                ];
            default:
                return [];
        }
    }, [user?.role]);

    const menuItems = React.useMemo(() => getMenuItems(), [getMenuItems]);

    return (
        <div className="sidebar">
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

            <div className="user-info">
                <div className="user-avatar">{getInitials(user?.fullName)}</div>
                <div className="user-details">
                    <h3>{user?.role === "admin" ? "System Admin" : user?.fullName}</h3>

                    <p className="user-role">
                        {user?.role === "admin" ? "Admin" :
                            user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Role"}
                    </p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                    if (item.disabled) {
                        return (
                            <div key={index} className="nav-item disabled">
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.name}</span>
                            </div>
                        );
                    }
                    if (item.isLiveMap) {
                        return (
                            <div key={index} className="nav-item" onClick={handleLiveMapClick} style={{ cursor: 'pointer' }}>
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.name}</span>
                            </div>
                        );
                    }
                    if (item.isTracking) {
                        return (
                            <div
                                key={index}
                                className="nav-item"
                                onClick={handleTrackingClick}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.name}</span>
                            </div>
                        );
                    }
                    return (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            end={item.path === '/admin' || item.path === '/dashboard'}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

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
