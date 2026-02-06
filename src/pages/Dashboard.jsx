import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        donationsCount: 0,
        requestsCount: 0,
        activePickups: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Helper to get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="loading">Loading dashboard...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <h1>{getGreeting()}, {user?.fullName}!</h1>
                    <p className="subtitle">Here's what's happening today.</p>
                </div>

                {/* Role-based Dashboard Content */}

                {/* DONOR DASHBOARD */}
                {user?.role === 'donor' && (
                    <div className="role-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🍱</div>
                                <div className="stat-content">
                                    <h3>My Donations</h3>
                                    <p className="stat-helper">Check your donation history</p>
                                    <button className="btn-link" onClick={() => navigate('/my-donations')}>View All →</button>
                                </div>
                            </div>
                            <div className="action-card">
                                <h3>New Donation</h3>
                                <p>Have surplus food? Share it now.</p>
                                <button className="btn-primary" onClick={() => navigate('/donate-food')}>Donate Food</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* NGO DASHBOARD */}
                {user?.role === 'ngo' && (
                    <div className="role-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🛍️</div>
                                <div className="stat-content">
                                    <h3>Available Food</h3>
                                    <p className="stat-helper">Browse food nearby</p>
                                    <button className="btn-link" onClick={() => navigate('/available-food')}>Browse →</button>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <h3>My Requests</h3>
                                    <p className="stat-helper">Track your requests</p>
                                    <button className="btn-link" onClick={() => navigate('/my-requests')}>View Status →</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VOLUNTEER DASHBOARD - DISABLED
                {user?.role === 'volunteer' && (
                    <div className="role-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🛵</div>
                                <div className="stat-content">
                                    <h3>Assignments</h3>
                                    <p className="stat-helper">Available delivery tasks</p>
                                    <button className="btn-link" disabled>Disabled</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                */}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
