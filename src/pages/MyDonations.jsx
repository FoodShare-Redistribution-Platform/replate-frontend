import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './MyDonations.css';

const MyDonations = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchDonations();
        }
    }, [user]);

    useEffect(() => {
        filterDonations();
    }, [donations, searchQuery, statusFilter]);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/donations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDonations(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const filterDonations = () => {
        let filtered = [...donations];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(d => d.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(d =>
                d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.foodType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter out expired donations (unless delivered or cancelled)
        filtered = filtered.filter(d => {
            if (['delivered', 'cancelled'].includes(d.status)) return true;
            if (!d.expiryDate || !d.expiryTime) return true;
            const expiryDateTime = new Date(`${d.expiryDate}T${d.expiryTime}`);
            return new Date() < expiryDateTime;
        });

        setFilteredDonations(filtered);
    };

    const getStats = () => {
        return {
            total: donations.length,
            delivered: donations.filter(d => d.status === 'delivered').length,
            inProgress: donations.filter(d => ['accepted', 'picked_up'].includes(d.status)).length,
            pending: donations.filter(d => d.status === 'pending').length
        };
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pending', class: 'status-pending' },
            accepted: { label: 'Accepted', class: 'status-accepted' },
            assigned: { label: 'Assigned', class: 'status-assigned' },
            in_transit: { label: 'In Transit', class: 'status-picked' }, // Using picked style
            picked_up: { label: 'Picked Up', class: 'status-picked' },
            delivered: { label: 'Delivered', class: 'status-delivered' },
            cancelled: { label: 'Cancelled', class: 'status-cancelled' },
            expired: { label: 'Expired', class: 'status-expired' }
        };
        return badges[status] || { label: status, class: 'status-default' };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const stats = getStats();

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="my-donations-page">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Donations</h1>
                        <p className="page-subtitle">Track and manage your food donations</p>
                    </div>
                    <button
                        className="btn-new-donation"
                        onClick={() => navigate('/donate-food')}
                    >
                        <span className="btn-icon">➕</span>
                        New Donation
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Donations</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <p className="stat-label">Delivered</p>
                            <p className="stat-value">{stats.delivered}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-content">
                            <p className="stat-label">In Progress</p>
                            <p className="stat-value">{stats.inProgress}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <p className="stat-label">Pending</p>
                            <p className="stat-value">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search donations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-box">
                        <span className="filter-icon">🎯</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Donations List */}
                <div className="donations-container">
                    {filteredDonations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🍱</div>
                            <h3 className="empty-title">No donations found</h3>
                            <p className="empty-text">
                                {donations.length === 0
                                    ? "You haven't made any donations yet. Start making a difference today!"
                                    : "No donations match your search criteria."}
                            </p>
                            {donations.length === 0 && (
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/donate-food')}
                                >
                                    Make Your First Donation
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="donations-grid">
                            {filteredDonations.map((donation) => (
                                <div key={donation._id} className="donation-card">
                                    {donation.foodPhoto && (
                                        <div className="donation-image-container">
                                            <img
                                                src={donation.foodPhoto}
                                                alt={donation.foodName}
                                                className="donation-image"
                                            />
                                        </div>
                                    )}

                                    <div className="donation-header">
                                        <h3 className="donation-title">{donation.foodName}</h3>
                                        <span className={`status-badge ${getStatusBadge(donation.status).class}`}>
                                            {getStatusBadge(donation.status).label}
                                        </span>
                                    </div>

                                    <div className="donation-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Type:</span>
                                            <span className="detail-value">{donation.foodType}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Quantity:</span>
                                            <span className="detail-value">
                                                {donation.quantity} {donation.unit}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Servings:</span>
                                            <span className="detail-value">{donation.estimatedServings} people</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Location:</span>
                                            <span className="detail-value">{donation.city}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Created:</span>
                                            <span className="detail-value">{formatDate(donation.createdAt)}</span>
                                        </div>
                                        {donation.assignedTo && (
                                            <div className="detail-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #334155' }}>
                                                <span className="detail-label">Volunteer:</span>
                                                <span className="detail-value" style={{ color: '#10b981' }}>
                                                    {donation.assignedTo.fullName} <br />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#94a3b8' }}>
                                                        📞 {donation.assignedTo.phone}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {donation.dietaryTags && donation.dietaryTags.length > 0 && (
                                        <div className="dietary-tags-row">
                                            {donation.dietaryTags.map(tag => (
                                                <span key={tag} className="dietary-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="donation-actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => {
                                                // TODO: Implement view details modal
                                                alert('View details coming soon!');
                                            }}
                                        >
                                            View Details
                                        </button>
                                        {donation.status === 'pending' && (
                                            <>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        // Navigate to donate-food with pre-filled data
                                                        navigate('/donate-food', {
                                                            state: {
                                                                editMode: true,
                                                                donationData: donation
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={async () => {
                                                        if (window.confirm(`Are you sure you want to delete "${donation.foodName}"? This action cannot be undone.`)) {
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                const response = await fetch(`http://localhost:5000/api/donations/${donation._id}`, {
                                                                    method: 'DELETE',
                                                                    headers: {
                                                                        'Authorization': `Bearer ${token}`
                                                                    }
                                                                });

                                                                if (response.ok) {
                                                                    alert('Donation deleted successfully!');
                                                                    // Refresh donations list
                                                                    fetchDonations();
                                                                } else {
                                                                    const data = await response.json();
                                                                    alert(`Failed to delete: ${data.message || 'Please try again'}`);
                                                                }
                                                            } catch (error) {
                                                                console.error('Error deleting donation:', error);
                                                                alert('An error occurred while deleting. Please try again.');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyDonations;
