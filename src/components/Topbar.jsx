import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import './Topbar.css';

const Topbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const translateRef = React.useRef(null);
    const [unreadCount, setUnreadCount] = React.useState(0);

    const getMenuItems = React.useCallback(() => {
        switch (user?.role) {
            case 'donor':
                return [
                    { name: 'Dashboard', enName: 'dashboard', path: '/dashboard' },
                    { name: 'Donate Food', enName: 'donate food', path: '/donate-food' },
                    { name: 'My Donations', enName: 'my donations', path: '/my-donations' },
                    { name: 'Live Map', enName: 'live map', disabled: true },
                    { name: 'Notifications', enName: 'notifications', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', path: '/impact' },
                    { name: 'Profile', enName: 'profile', path: '/profile' }
                ];
            case 'ngo':
                return [
                    { name: 'Dashboard', enName: 'dashboard', path: '/dashboard' },
                    { name: 'Available Food', enName: 'available food', path: '/available-food' },
                    { name: 'My Requests', enName: 'my requests', path: '/my-requests' },
                    { name: 'Live Map', enName: 'live map', disabled: true },
                    { name: 'Notifications', enName: 'notifications', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', path: '/impact' },
                    { name: 'Profile', enName: 'profile', path: '/profile' }
                ];
            case 'volunteer':
                return [
                    { name: 'Dashboard', enName: 'dashboard', path: '/dashboard' },
                    { name: 'Assignments', enName: 'assignments', path: '/assignments' },
                    { name: 'My Pickups', enName: 'my pickups', path: '/my-pickups' },
                    { name: 'Availability', enName: 'availability', path: '/availability' },
                    { name: 'Live Map', enName: 'live map', isLiveMap: true },
                    { name: 'Notifications', enName: 'notifications', path: '/notifications' },
                    { name: 'Impact', enName: 'impact', path: '/impact' },
                    { name: 'Profile', enName: 'profile', path: '/profile' }
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', enName: 'dashboard', path: '/admin' },
                    { name: 'All Users', enName: 'all users', path: '/admin/users' },
                    { name: 'Donors', enName: 'donors', path: '/admin/users?role=donor' },
                    { name: 'NGOs', enName: 'ngos', path: '/admin/users?role=ngo' },
                    { name: 'Volunteers', enName: 'volunteers', path: '/admin/users?role=volunteer' },
                    { name: 'Donations', enName: 'donations', disabled: true },
                    { name: 'Assignments', enName: 'assignments', disabled: true },
                    { name: 'Impact', enName: 'impact', path: '/impact' }
                ];
            default:
                return [];
        }
    }, [user?.role]);

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
        const addGoogleTranslateScript = () => {
            // Check if script already exists
            if (document.getElementById('google-translate-script')) {
                // If it exists, and window.google is ready, we force a re-render
                if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                    if (translateRef.current && translateRef.current.innerHTML === '') {
                        window.googleTranslateElementInit();
                    }
                }
                return;
            }

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    { pageLanguage: 'en', includedLanguages: 'en,hi,ta,ml,te,kn', autoDisplay: false },
                    'google_translate_element'
                );
            };

            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        };

        addGoogleTranslateScript();
    }, []);

    // Re-initialize widget when route changes
    React.useEffect(() => {
        if (translateRef.current && translateRef.current.innerHTML === '') {
            if (window.google && window.google.translate && window.googleTranslateElementInit) {
                // We use setTimeout to ensure it happens after React's paint
                setTimeout(() => {
                    // Clear the generated iframe and elements from the body if they exist
                    const iframe = document.querySelector('.goog-te-menu-frame');
                    if (iframe) iframe.remove();

                    if (translateRef.current) {
                        translateRef.current.innerHTML = '';
                    }
                    window.googleTranslateElementInit();
                }, 200);
            }
        }
    }, [location.pathname]);

    React.useEffect(() => {
        if (user?.role === 'admin') return;

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
    }, [user?.role]);

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
                        title={isListening ? 'Listening...' : 'Voice Navigate'}
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




                {/* Google Translate Element */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <div id="google_translate_element" ref={translateRef} className="google-translate-container"></div>
                </div>

                {/* Notifications */}
                {user?.role !== 'admin' && (
                    <button
                        className="icon-btn notification-btn"
                        title="Notifications"
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
                )}

                {/* User Avatar */}
                <div className="user-avatar-container" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar-small">
                        {getInitials(user?.fullName)}
                    </div>
                    <div className="user-info-small">
                       <span className="user-name-small">
{user?.role === "admin" ? "System Admin" : user?.fullName || "User"}
</span>

<span className="user-role-small">
{user?.role === "admin" ? "Admin" : user?.role || "Role"}
</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
