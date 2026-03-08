import React, { useState, useEffect } from 'react';

import { getDonations } from '../../api/admin';
import { Package, CheckCircle, Clock } from 'lucide-react';
import './AdminPages.css';

const FoodManagement = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getDonations(token);
            console.log("== ADMIN DONATIONS FETCHED ==", data);
            setDonations(data || []);
        } catch (err) {
            console.error("Failed to fetch donations", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: donations.length,
        available: donations.filter(d => d.status === 'available').length,
        claimed: donations.filter(d => ['claimed', 'picked_up', 'delivered'].includes(d.status)).length,
        expiringSoon: 0 // Mock stat for now
    };

    const filteredDonations = donations.filter(d => {
        if (statusFilter !== 'All Status' && d.status !== statusFilter) return false;
        if (categoryFilter !== 'All Categories' && d.foodType !== categoryFilter) return false;
        return true;
    });

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>Donations</h1>
                    <p>Manage and monitor all food donations on the platform</p>
                </div>
                <button className="refresh-btn" onClick={fetchDonations}>
                    <Clock size={16} /> Refresh
                </button>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Donations</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-green">{stats.available}</div>
                    <div className="stat-label">Available</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-blue">{stats.claimed}</div>
                    <div className="stat-label">Claimed</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-orange">{stats.expiringSoon}</div>
                    <div className="stat-label">Expiring Soon</div>
                </div>
            </div>

            <div className="admin-filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All Status">All Status</option>
                    <option value="pending">Pending / Available</option>
                    <option value="accepted">Accepted</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_transit">In Transit</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                </select>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="All Categories">All Categories</option>
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery Items">Bakery Items</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Raw Vegetables">Raw Vegetables</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="admin-content-area">
                {loading ? (
                    <div className="loading-state">Loading donations...</div>
                ) : filteredDonations.length === 0 ? (
                    <div className="empty-state">
                        <Package size={48} />
                        <p>No donations found</p>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th>Food Item</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Expiry</th>
                                    <th>City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonations.map(donation => (
                                    <tr key={donation._id}>
                                        <td>
                                            <div className="item-name">{donation.foodName}</div>
                                            <div className="item-subtext">Donor: {donation.donor?.organizationName || donation.donor?.fullName || 'Unknown'}</div>
                                        </td>
                                        <td>{donation.foodType}</td>
                                        <td>{donation.quantity} {donation.unit}</td>
                                        <td>
                                            <span className={`status-badge ${'status-' + (donation.status || (statusFilter !== 'All Status' ? statusFilter : 'pending')).toLowerCase()}`}>
                                                {donation.status || (statusFilter !== 'All Status' ? statusFilter : 'Pending')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="item-name">{donation.expiryDate}</div>
                                            <div className="item-subtext">{donation.expiryTime}</div>
                                        </td>
                                        <td>{donation.city}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodManagement;
