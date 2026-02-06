import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import './MyPickups.css';

const MyPickups = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ upcoming: 0, inProgress: 0, completed: 0, total: 0 });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchPickups();
    }, []);

    const fetchPickups = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            const userId = user?.id || user?._id;

            const response = await fetch(`http://localhost:5000/api/assignments/volunteer/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                setPickups(data);

                // Calculate stats
                const upcoming = data.filter(p => ['accepted', 'assigned'].includes(p.status)).length;
                const inProgress = data.filter(p => p.status === 'in_transit').length;
                const completed = data.filter(p => p.status === 'completed').length;

                setStats({
                    upcoming: upcoming + inProgress, // Grouping for "Upcoming" count card
                    inProgress: inProgress,
                    completed: completed,
                    total: data.length
                });
            }
        } catch (error) {
            console.error('Error fetching pickups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (assignmentId, action) => {
        const endpoint = action === 'pickup'
            ? `http://localhost:5000/api/assignments/${assignmentId}/update-location` // Using update-location to trigger transit
            : `http://localhost:5000/api/assignments/${assignmentId}/complete`;

        const body = action === 'pickup'
            ? { lat: 12.9716, lng: 77.5946 } // Default to Bangalore coordinates
            : {};

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchPickups(); // Refresh
                if (action === 'pickup') alert('Pickup confirmed! Status updated to In Transit.');
                if (action === 'deliver') alert('Delivery confirmed! Great job.');
            } else {
                const err = await response.json();
                alert(`Failed to update status: ${err.message}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating status.');
        }
    };

    // Filter Logic
    const getFilteredPickups = () => {
        if (activeTab === 'upcoming') {
            return pickups.filter(p => ['assigned', 'accepted', 'in_transit'].includes(p.status));
        } else if (activeTab === 'completed') {
            return pickups.filter(p => p.status === 'completed');
        }
        return pickups;
    };

    return (
        <DashboardLayout user={user}>
            <div className="pickups-container">
                <div className="pickups-header">
                    <h1>My Pickups</h1>
                    <p>View and manage your assigned pickup tasks</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card dark">
                        <div className="stat-value blue">{stats.upcoming}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                    <div className="stat-card dark">
                        <div className="stat-value orange">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                    <div className="stat-card dark">
                        <div className="stat-value green">{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card dark">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Pickups
                    </button>
                </div>

                {/* Search */}
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search pickups..." />
                </div>

                {/* List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div> // Matches screenshot spinner
                    </div>
                ) : (
                    <div className="pickups-list">
                        {getFilteredPickups().length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No pickups found.</p>
                        ) : (
                            getFilteredPickups().map(pickup => (
                                <div key={pickup._id} className="pickup-card">
                                    <div className="pickup-info">
                                        <h4>{pickup.donation?.foodName || 'Food Donation'}</h4>
                                        <div className="pickup-route">
                                            <span>🟢 Pickup: {pickup.donor?.organizationName || pickup.donor?.fullName || 'Donor'}</span>
                                            <span>🔴 Drop: {pickup.donation?.acceptedBy?.organizationName || pickup.donation?.acceptedBy?.name || 'NGO'}</span>
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className={`status-badge ${pickup.status}`}>
                                                {pickup.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pickup-actions">
                                        {['accepted', 'assigned'].includes(pickup.status) && (
                                            <button
                                                className="action-btn btn-pickup"
                                                onClick={() => handleStatusUpdate(pickup._id, 'pickup')}
                                            >
                                                Mark Picked Up
                                            </button>
                                        )}
                                        {pickup.status === 'in_transit' && (
                                            <button
                                                className="action-btn btn-deliver"
                                                onClick={() => handleStatusUpdate(pickup._id, 'deliver')}
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyPickups;
