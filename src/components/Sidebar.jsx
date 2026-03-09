import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import './Sidebar.css';

const Sidebar = ({ user }) => {
    const { t } = useTranslation();
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
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: t('sidebar.donateFood', 'Donate Food'), enName: 'donate food', icon: '🍱', path: '/donate-food' },
                    { name: t('sidebar.myDonations', 'My Donations'), enName: 'my donations', icon: '📦', path: '/my-donations' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', icon: '🗺️',  isTracking: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', icon: '📈', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'ngo':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: t('sidebar.availableFood', 'Available Food'), enName: 'available food', icon: '🍱', path: '/available-food' },
                    { name: t('sidebar.myRequests', 'My Requests'), enName: 'my requests', icon: '📦', path: '/my-requests' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', icon: '🗺️',  isTracking: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', icon: '📈', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'volunteer':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', icon: '📊', path: '/dashboard' },
                    { name: t('sidebar.assignments', 'Assignments'), enName: 'assignments', icon: '📝', path: '/assignments' },
                    { name: t('sidebar.myPickups', 'My Pickups'), enName: 'my pickups', icon: '🛵', path: '/my-pickups' },
                    { name: t('sidebar.availability', 'Availability'), enName: 'availability', icon: '⏰', path: '/availability' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', icon: '🗺️', isLiveMap: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', icon: '🔔', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', icon: '📈', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', icon: '👤', path: '/profile' }
                ];
            case 'admin':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', icon: '📊', path: '/admin' },
                    { name: t('sidebar.allUsers', 'All Users'), enName: 'all users', icon: '👥', path: '/admin/users' },
                    { name: t('sidebar.donors', 'Donors'), enName: 'donors', icon: '🤝', path: '/admin/users?role=donor' },
                    { name: t('sidebar.ngos', 'NGOs'), enName: 'ngos', icon: '🏢', path: '/admin/users?role=ngo' },
                    { name: t('sidebar.volunteers', 'Volunteers'), enName: 'volunteers', icon: '🚴', path: '/admin/users?role=volunteer' },
                    { name: t('sidebar.donations', 'Donations'), enName: 'donations', icon: '📦', disabled: true },
                    { name: t('sidebar.assignments', 'Assignments'), enName: 'assignments', icon: '🚚', disabled: true },
                     { name: t('sidebar.liveMap', 'Fleet Map'), enName: 'live map', icon: '🗺️',  path: '/admin/live-map'},
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', icon: '📈', path: '/impact' }
                ];
            default:
                return [];
        }
    }, [user?.role, t]);

    const menuItems = React.useMemo(() => getMenuItems(), [getMenuItems]);

    const handleVoiceCommand = React.useCallback((transcript) => {
        if (!transcript) return;
        let lowerTranscript = transcript.toLowerCase().trim().replace(/[.,?!]$/g, '');
        lowerTranscript = lowerTranscript.replace(/^(go to|go|navigate to|navigate|take me to|take me|open)\s+/i, '');

        if (lowerTranscript.includes("logout") || lowerTranscript.includes("sign out")) {
            handleLogout();
            return;
        }

        for (const item of menuItems) {
            if (item.disabled) continue;
            const lowerNavName = item.name.toLowerCase().trim();
            const lowerEnName = item.enName?.toLowerCase().trim() || "";

            if (lowerTranscript.includes(lowerNavName) || lowerNavName.includes(lowerTranscript) ||
                (lowerEnName && (lowerTranscript.includes(lowerEnName) || lowerEnName.includes(lowerTranscript))) ||
                (lowerEnName === "profile" && lowerTranscript.includes("account"))) {

                if (item.isLiveMap) {
                    handleLiveMapClick();
                } else if (item.path) {
                    navigate(item.path);
                }
                return;
            }
        }
    }, [menuItems, handleLogout, handleLiveMapClick, navigate]);

    const { isListening, toggleListening, isSupported } = useVoiceRecognition(handleVoiceCommand);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="logo-text">
                    <h2>{t('sidebar.appName', 'FoodShare')}</h2>
                    <p>{t('sidebar.appSubtitle', 'Redistribution Platform')}</p>
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
                    <span className="nav-text">{t('sidebar.logout', 'Logout')}</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
