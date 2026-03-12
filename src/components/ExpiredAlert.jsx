import React, { useState, useEffect } from 'react';
import './ExpiredAlert.css';

const ExpiredAlert = () => {
    const [expiredNotifications, setExpiredNotifications] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === 'admin') return;
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }

        const fetchExpiredAlerts = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Filter for UNREAD notifications of type 'food_expired'
                    const unreadExpired = data.filter(n => n.type === 'food_expired' && !n.isRead);
                    
                    setExpiredNotifications(unreadExpired);
                }
            } catch (error) {
                console.error('Error fetching expired notifications:', error);
            }
        };

        fetchExpiredAlerts();
        
        // Poll every 10 seconds to detect new expiry alerts immediately
        const interval = setInterval(fetchExpiredAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove out from local state
                setExpiredNotifications(prev => prev.filter(n => n._id !== notificationId));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (expiredNotifications.length === 0) return null;

    return (
        <div className="expired-alert-overlay">
            {expiredNotifications.map(notification => (
                <div key={notification._id} className="expired-alert-box">
                    <div className="expired-alert-icon">⚠️</div>
                    <div className="expired-alert-content">
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                    </div>
                    <button 
                        className="expired-alert-btn"
                        onClick={() => markAsRead(notification._id)}
                    >
                        Acknowledge
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ExpiredAlert;
