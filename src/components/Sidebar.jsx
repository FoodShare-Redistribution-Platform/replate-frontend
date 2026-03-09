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

    const handleLiveMapClick = async () => {
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

            if (!res.ok) {
                alert("No active assignment right now");
                return;
            }

            const assignment = await res.json();
            navigate(`/live-map/${assignment._id}`);
        } catch (err) {
            console.error(err);
            alert("Unable to open live map");
        }
    };

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

    const getMenuItems = () => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Donate Food', icon: '🍱', path: '/donate-food' },
                    { name: 'My Donations', icon: '📦', path: '/my-donations' },
                    { name: 'Live Map', icon: '🗺️', isTracking: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', icon: '👤', path: '/profile' }
                ];
            case 'ngo':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Available Food', icon: '🍱', path: '/available-food' },
                    { name: 'My Requests', icon: '📦', path: '/my-requests' },
                    { name: 'Live Map', icon: '🗺️', isTracking: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', icon: '👤', path: '/profile' }
                ];
            case 'volunteer':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
                    { name: 'Assignments', icon: '📝', path: '/assignments' },
                    { name: 'My Pickups', icon: '🛵', path: '/my-pickups' },
                    { name: 'Availability', icon: '⏰', path: '/availability' },
                    { name: 'Live Map', icon: '🗺️', isLiveMap: true },
                    { name: 'Notifications', icon: '🔔', path: '/notifications' },
                    { name: 'Impact', icon: '📈', path: '/impact' },
                    { name: 'Profile', icon: '👤', path: '/profile' }
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', icon: '📊', path: '/admin' },
                    { name: 'All Users', icon: '👥', path: '/admin/users' },
                    { name: 'Donors', icon: '🤝', path: '/admin/users?role=donor' },
                    { name: 'NGOs', icon: '🏢', path: '/admin/users?role=ngo' },
                    { name: 'Volunteers', icon: '🚴', path: '/admin/users?role=volunteer' },
                    { name: 'Donations', icon: '📦', disabled: true },
                    { name: 'Assignments', icon: '🚚', disabled: true },
                    { name: 'Fleet Map', icon: '🗺️', path: '/admin/live-map' },
                    { name: 'Impact', icon: '📈', path: '/impact' }
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

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
                            <div key={index} className="nav-item" onClick={handleLiveMapClick}>
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.name}</span>
                            </div>
                        );
                    }

                    if (item.isTracking) {
                        return (
                            <div key={index} className="nav-item" onClick={handleTrackingClick}>
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-text">{item.name}</span>
                            </div>
                        );
                    }

                    return (
                        <Link key={index} to={item.path} className="nav-item">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </Link>
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
