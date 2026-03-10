import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const { user } = useOutletContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
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
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
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

    const deleteNotification = async (e, id) => {
        e.stopPropagation(); // prevent clicking the background
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== id));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        if (!window.confirm("Are you sure you want to delete all notifications?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/clear-all`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return (
        <div className="admin-page-container notifications-page">
            <div className="page-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your latest alerts</p>
                </div>
                {notifications.length > 0 && (
                    <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                        <button className="mark-all-btn" onClick={markAllAsRead}>
                            Mark all as read
                        </button>
                        <button className="clear-all-btn" onClick={clearAllNotifications}>
                            Clear all
                        </button>
                    </div>
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
                            <button
                                className="dismiss-btn"
                                onClick={(e) => deleteNotification(e, notification._id)}
                                title="Dismiss this notification"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
