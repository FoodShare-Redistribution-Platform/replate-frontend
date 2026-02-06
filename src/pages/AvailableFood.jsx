import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './AvailableFood.css';

const AvailableFood = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchUser();
        fetchAvailableDonations();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/me', {
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

    const fetchAvailableDonations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/donations/available', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setDonations(data.data);
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestFood = async (donationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ donationId })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Food requested successfully!');
                fetchAvailableDonations(); // Refresh list
            } else {
                alert(`Failed to request: ${data.message}`);
            }
        } catch (error) {
            console.error('Error requesting food:', error);
            alert('An error occurred while requesting food.');
        }
    };

    // Calculate stats
    const stats = {
        availableNow: donations.length,
        critical: donations.filter(d => {
            const expiry = new Date(`${d.expiryDate}T${d.expiryTime}`);
            const now = new Date();
            const hoursLeft = (expiry - now) / (1000 * 60 * 60);
            return hoursLeft < 1 && hoursLeft > 0;
        }).length,
        highPriority: donations.filter(d => {
            const expiry = new Date(`${d.expiryDate}T${d.expiryTime}`);
            const now = new Date();
            const hoursLeft = (expiry - now) / (1000 * 60 * 60);
            return hoursLeft < 6 && hoursLeft > 0;
        }).length,
        totalServings: donations.reduce((sum, d) => sum + (d.estimatedServings || 0), 0)
    };

    // Filter donations
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.foodType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || donation.foodType === filterType;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="available-food-page">
                    <div className="loading">Loading available food...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="available-food-page">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">Available Food</h1>
                    <p className="page-subtitle">Browse and request surplus food from nearby donors</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🍱</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.availableNow}</div>
                            <div className="stat-label">Available Now</div>
                        </div>
                    </div>
                    <div className="stat-card critical">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.critical}</div>
                            <div className="stat-label">Critical (&lt; 1hr)</div>
                        </div>
                    </div>
                    <div className="stat-card priority">
                        <div className="stat-icon">⏰</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.highPriority}</div>
                            <div className="stat-label">High Priority</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">❤️</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.totalServings}</div>
                            <div className="stat-label">Total Servings</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search food or donor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-dropdown"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Food Types</option>
                        <option value="Cooked Meals">Cooked Meals</option>
                        <option value="Fresh Produce">Fresh Produce</option>
                        <option value="Packaged Food">Packaged Food</option>
                        <option value="Baked Goods">Baked Goods</option>
                        <option value="Beverages">Beverages</option>
                    </select>
                </div>

                {/* Donations Grid */}
                {filteredDonations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🍱</div>
                        <p>No food available matching your criteria</p>
                    </div>
                ) : (
                    <div className="donations-grid">
                        {filteredDonations.map(donation => {
                            const expiry = new Date(`${donation.expiryDate}T${donation.expiryTime}`);
                            const now = new Date();
                            const hoursLeft = (expiry - now) / (1000 * 60 * 60);
                            const isUrgent = hoursLeft < 6;

                            return (
                                <div key={donation._id} className={`donation-card ${isUrgent ? 'urgent' : ''}`}>
                                    {donation.foodPhoto && (
                                        <div className="donation-image-container">
                                            <img src={donation.foodPhoto} alt={donation.foodName} className="donation-image" />
                                        </div>
                                    )}
                                    <div className="donation-content">
                                        <div className="donation-header">
                                            <h3 className="donation-name">{donation.foodName}</h3>
                                            <span className="food-type-badge">{donation.foodType}</span>
                                        </div>

                                        <div className="donation-details">
                                            <div className="detail-row">
                                                <span className="detail-icon">📦</span>
                                                <span>{donation.quantity} {donation.unit}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-icon">🍽️</span>
                                                <span>{donation.estimatedServings} servings</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-icon">📍</span>
                                                <span>{donation.city}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-icon">⏰</span>
                                                <span className={isUrgent ? 'urgent-text' : ''}>
                                                    {hoursLeft > 0 ? `${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}m left` : 'Expired'}
                                                </span>
                                            </div>
                                        </div>

                                        {donation.dietaryTags && donation.dietaryTags.length > 0 && (
                                            <div className="dietary-tags">
                                                {donation.dietaryTags.map(tag => (
                                                    <span key={tag} className="dietary-tag">{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            className="btn-request"
                                            onClick={() => handleRequestFood(donation._id)}
                                        >
                                            Request Food
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AvailableFood;
