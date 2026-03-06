import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import './Topbar.css';

const Topbar = ({ user }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = React.useState(0);

    const getMenuItems = React.useCallback(() => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', path: '/dashboard' },
                    { name: t('sidebar.donateFood', 'Donate Food'), enName: 'donate food', path: '/donate-food' },
                    { name: t('sidebar.myDonations', 'My Donations'), enName: 'my donations', path: '/my-donations' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', disabled: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', path: '/profile' }
                ];
            case 'ngo':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', path: '/dashboard' },
                    { name: t('sidebar.availableFood', 'Available Food'), enName: 'available food', path: '/available-food' },
                    { name: t('sidebar.myRequests', 'My Requests'), enName: 'my requests', path: '/my-requests' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', disabled: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', path: '/profile' }
                ];
            case 'volunteer':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', path: '/dashboard' },
                    { name: t('sidebar.assignments', 'Assignments'), enName: 'assignments', path: '/assignments' },
                    { name: t('sidebar.myPickups', 'My Pickups'), enName: 'my pickups', path: '/my-pickups' },
                    { name: t('sidebar.availability', 'Availability'), enName: 'availability', path: '/availability' },
                    { name: t('sidebar.liveMap', 'Live Map'), enName: 'live map', isLiveMap: true },
                    { name: t('sidebar.notifications', 'Notifications'), enName: 'notifications', path: '/notifications' },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', path: '/impact' },
                    { name: t('sidebar.profile', 'Profile'), enName: 'profile', path: '/profile' }
                ];
            case 'admin':
                return [
                    { name: t('sidebar.dashboard', 'Dashboard'), enName: 'dashboard', path: '/admin' },
                    { name: t('sidebar.allUsers', 'All Users'), enName: 'all users', path: '/admin/users' },
                    { name: t('sidebar.donors', 'Donors'), enName: 'donors', path: '/admin/users?role=donor' },
                    { name: t('sidebar.ngos', 'NGOs'), enName: 'ngos', path: '/admin/users?role=ngo' },
                    { name: t('sidebar.volunteers', 'Volunteers'), enName: 'volunteers', path: '/admin/users?role=volunteer' },
                    { name: t('sidebar.donations', 'Donations'), enName: 'donations', disabled: true },
                    { name: t('sidebar.assignments', 'Assignments'), enName: 'assignments', disabled: true },
                    { name: t('sidebar.impact', 'Impact'), enName: 'impact', path: '/impact' }
                ];
            default:
                return [];
        }
    }, [user?.role, t]);

    const handleLiveMapClick = React.useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5001/api/assignments/volunteer-active", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return;
            const assignment = await res.json();
            navigate(`/live-map/${assignment._id}`);
        } catch (err) { }
    }, [navigate]);

    const menuItems = React.useMemo(() => getMenuItems(), [getMenuItems]);

    const handleVoiceCommand = React.useCallback((transcript) => {
        console.log("Topbar heard:", transcript);
        if (!transcript) return;

        // Clean up the transcript: lowercase, remove punctuation, and remove common prefix words
        let lowerTranscript = transcript.toLowerCase().trim().replace(/[.,?!]$/g, '');
        lowerTranscript = lowerTranscript.replace(/^(go to|go|navigate to|navigate|take me to|take me|open)\s+/i, '');

        if (lowerTranscript.includes("logout") || lowerTranscript.includes("sign out")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
        }

        // Try to match the spoken transcript with any of the currently available menu item translated names
        for (const item of menuItems) {
            if (item.disabled) continue;

            const lowerNavName = item.name.toLowerCase().trim();
            const lowerEnName = item.enName?.toLowerCase().trim() || "";

            // Match the translated name in the current language, OR the English name
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
    }, [menuItems, handleLiveMapClick, navigate]);

    const { isListening, toggleListening, isSupported } = useVoiceRecognition(handleVoiceCommand);

    React.useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5001/api/notifications/unread-count', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
                {/* Voice Navigation Toggle */}
                {isSupported && (
                    <button
                        className={`icon-btn ${isListening ? 'listening' : ''}`}
                        title={isListening ? t('voice.listening', 'Listening...') : t('voice.start', 'Voice Navigate')}
                        onClick={toggleListening}
                        style={{ background: isListening ? '#10b981' : 'transparent', color: isListening ? 'white' : 'inherit' }}
                    >
                        {isListening ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                                <span style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
                                <span style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
                            </div>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="22" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Theme Toggle placeholder */}
                <button className="icon-btn" title={t('topbar.toggleTheme', 'Toggle Theme')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                    </svg>
                </button>


                {/* Language Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <select
                        className="lang-select"
                        title={t('topbar.language', 'Language')}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        value={i18n.language || 'en'}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', outline: 'none', fontSize: '0.95rem', fontWeight: '500', appearance: 'none', padding: '0 5px' }}
                    >
                        <option value="en" style={{ color: '#000' }}>English</option>
                        <option value="hi" style={{ color: '#000' }}>Hindi</option>
                        <option value="ta" style={{ color: '#000' }}>Tamil</option>
                        <option value="ml" style={{ color: '#000' }}>Malayalam</option>
                    </select>
                </div>

                {/* Notifications */}
                <button
                    className="icon-btn notification-btn"
                    title={t('topbar.notifications', 'Notifications')}
                    onClick={() => navigate('/notifications')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                </button>

                {/* User Avatar */}
                <div className="user-avatar-container" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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
