import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './MyRequests.css';

const MyRequests = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchUser();
        fetchRequests();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/requests/${requestId}/accept`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert('Request accepted successfully!');
                fetchRequests();
            } else {
                alert(`Failed to accept: ${data.message}`);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('An error occurred.');
        }
    };

    const handlePickup = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/requests/${requestId}/pickup`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert('Marked as picked up!');
                fetchRequests();
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    const handleDeliver = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/requests/${requestId}/deliver`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert('Marked as delivered!');
                fetchRequests();
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    const handleCancel = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/requests/${requestId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: 'Cancelled by NGO' })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Request cancelled.');
                fetchRequests();
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    // Calculate stats
    const stats = {
        total: requests.length,
        active: requests.filter(r => ['pending', 'accepted', 'picked_up'].includes(r.status)).length,
        delivered: requests.filter(r => r.status === 'delivered').length,
        cancelled: requests.filter(r => r.status === 'cancelled').length
    };

    // Filter requests
    const filteredRequests = filterStatus === 'all'
        ? requests
        : requests.filter(r => r.status === filterStatus);

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'status-pending',
            accepted: 'status-accepted',
            assigned: 'status-assigned',
            picked_up: 'status-picked-up',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return classes[status] || '';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pending',
            accepted: 'Accepted',
            assigned: 'Assigned',
            picked_up: 'Picked Up',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return texts[status] || status;
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="my-requests-page">
                    <div className="loading">Loading requests...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="my-requests-page">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">My Requests</h1>
                    <p className="page-subtitle">Track and manage your food requests</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Requests</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.active}</div>
                            <div className="stat-label">Active</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.delivered}</div>
                            <div className="stat-label">Delivered</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">❌</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.cancelled}</div>
                            <div className="stat-label">Cancelled</div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="filter-bar">
                    <select
                        className="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Requests Grid */}
                {filteredRequests.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <p>No requests found</p>
                    </div>
                ) : (
                    <div className="requests-grid">
                        {filteredRequests.map(request => (
                            <div key={request._id} className="request-card">
                                <div className="request-header">
                                    <h3 className="request-title">{request.donation?.foodName || 'N/A'}</h3>
                                    <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                                        {getStatusText(request.status)}
                                    </span>
                                </div>

                                <div className="request-details">
                                    <div className="detail-row">
                                        <span className="detail-icon">🍱</span>
                                        <span>{request.donation?.foodType || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-icon">📦</span>
                                        <span>{request.donation?.quantity} {request.donation?.unit}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-icon">🍽️</span>
                                        <span>{request.donation?.estimatedServings} servings</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-icon">📍</span>
                                        <span>{request.donation?.city || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-icon">📅</span>
                                        <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                                    </div>
                                    {(request.volunteer || request.donation?.assignedTo) && (
                                        <div className="detail-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #334155' }}>
                                            <span className="detail-icon">🛵</span>
                                            <span>
                                                Volunteer: <strong style={{ color: '#10b981' }}>{request.volunteer?.fullName || request.donation?.assignedTo?.fullName}</strong>
                                                <br />
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '1.5rem' }}>
                                                    📞 {request.volunteer?.phone || request.donation?.assignedTo?.phone}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {request.donation?.dietaryTags && request.donation.dietaryTags.length > 0 && (
                                    <div className="dietary-tags">
                                        {request.donation.dietaryTags.map(tag => (
                                            <span key={tag} className="dietary-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="request-actions">
                                    {request.status === 'pending' && (
                                        <>
                                            <button className="btn-accept" onClick={() => handleAccept(request._id)}>
                                                Accept
                                            </button>
                                            <button className="btn-cancel" onClick={() => handleCancel(request._id)}>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {request.status === 'accepted' && (
                                        <span className="status-text" style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                            Waiting for volunteer pickup...
                                        </span>
                                    )}
                                    {request.status === 'picked_up' && (
                                        <span className="status-text" style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                            In transit...
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyRequests;
