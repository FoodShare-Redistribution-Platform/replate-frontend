import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/notifications/read-all', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_assignment': return '📝';
            case 'assignment_update': return '🛵';
            case 'status_update': return '✅';
            default: return '🔔';
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification._id);

        // Navigation logic based on data
        if (notification.type === 'new_assignment') {
            window.location.href = '/assignments';
        } else if (notification.type === 'status_update' || notification.type === 'assignment_update') {
            if (user?.role === 'volunteer') {
                window.location.href = '/my-pickups';
            } else if (user?.role === 'ngo') {
                window.location.href = '/my-requests';
            } else if (user?.role === 'donor') {
                window.location.href = '/my-donations';
            }
        }
    };

    return (
        <div className="layout">
            <Sidebar user={user} />
            <div className="main-content">
                <Topbar user={user} />
                <div className="page-container">
                    <div className="page-header">
                        <div>
                            <h1>Notifications</h1>
                            <p>Stay updated with your latest alerts</p>
                        </div>
                        {notifications.length > 0 && (
                            <button className="mark-all-btn" onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔔</div>
                            <h3>All caught up!</h3>
                            <p>You don't have any notifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="notifications-list">
                            {notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <h3>{notification.title}</h3>
                                            <span className="notification-time">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p>{notification.message}</p>
                                    </div>
                                    {!notification.isRead && <div className="unread-dot"></div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
