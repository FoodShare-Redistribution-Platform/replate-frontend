import React from 'react';
import './Topbar.css';

const Topbar = ({ user }) => {
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
            {/* Search Bar */}
            <div className="search-container">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    disabled
                />
            </div>

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
                <button className="icon-btn notification-btn" title="Notifications">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="notification-badge">3</span>
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
