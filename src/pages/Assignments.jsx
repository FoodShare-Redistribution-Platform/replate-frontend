import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import './Assignments.css';

const Assignments = () => {
    const [user, setUser] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ available: 0, urgent: 0, nearby: 0 });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/assignments/available', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                setAssignments(data);
                setStats({
                    available: data.length,
                    urgent: 0,
                    nearby: 0
                });
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (donationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/assignments/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ donationId })
            });

            if (response.ok) {
                alert('Assignment Accepted!');
                fetchAssignments();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to accept assignment');
            }
        } catch (error) {
            console.error('Error accepting assignment:', error);
        }
    };

    return (
        <DashboardLayout user={user}>
            <div className="assignments-container">
                <div className="assignments-header">
                    <h1>Available Assignments</h1>
                    <p>Browse and accept pickup assignments in your area</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card dark">
                        <div className={`stat-value ${stats.available > 0 ? 'green' : 'red'}`}>{stats.available}</div>
                        <div className="stat-label">Available</div>
                    </div>
                    <div className="stat-card dark">
                        <div className="stat-value red">{stats.urgent}</div>
                        <div className="stat-label">Urgent (&lt;6hrs)</div>
                    </div>
                    <div className="stat-card dark">
                        <div className="stat-value blue">{stats.nearby}</div>
                        <div className="stat-label">Nearby (&lt;5km)</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filter-bar">
                    <div className="filter-item">
                        <button className="square-btn">
                            <span>◻️</span>
                        </button>
                    </div>
                    <div className="filter-item">
                        <select className="dropdown-select">
                            <option>All Types</option>
                            <option>Veg</option>
                            <option>Non-Veg</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <select className="dropdown-select">
                            <option>Any Distance</option>
                            <option>&lt; 5 km</option>
                            <option>&lt; 10 km</option>
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="empty-state">
                        <div className="empty-icon">⏳</div>
                        <p>Loading assignments...</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Assignments Available</h3>
                        <p>Check back later for new pickup opportunities in your area.</p>
                    </div>
                ) : (
                    <div className="assignments-list">
                        {assignments.map(assign => (
                            <div key={assign._id} className="assignment-card">
                                <div className="assignment-info">
                                    <h4>{assign.foodName || 'Food Donation'}</h4>
                                    <div className="assignment-details">
                                        <span>📍 {assign.pickupAddress || 'Unknown Location'}</span>
                                        <span>•</span>
                                        <span>⚖️ {assign.quantity} {assign.unit || 'kg'}</span>
                                    </div>
                                </div>
                                <button
                                    className="accept-btn"
                                    onClick={() => handleAccept(assign._id)}
                                >
                                    Accept Delivery
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Assignments;
