import React, { useState, useEffect } from 'react';

import { getUsers } from '../../api/admin';
import { Bike, ShieldCheck, User } from 'lucide-react';
import './AdminPages.css';

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getUsers(token, { role: 'volunteer' });
            setVolunteers(data.users || []);
        } catch (err) {
            console.error("Failed to fetch volunteers", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: volunteers.length,
        verified: volunteers.filter(v => v.verificationStatus === 'approved').length,
        activeNow: volunteers.filter(v => v.status === 'active').length,
        withVehicle: volunteers.filter(v => v.hasVehicle).length
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>Volunteer Management</h1>
                    <p>Manage and monitor volunteer accounts and activities</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Volunteers</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-green">{stats.verified}</div>
                    <div className="stat-label">Verified</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-blue">{stats.activeNow}</div>
                    <div className="stat-label">Active Now</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-purple">{stats.withVehicle}</div>
                    <div className="stat-label">With Vehicle</div>
                </div>
            </div>

            <div className="admin-filters">
                <select>
                    <option>All Volunteers</option>
                    <option>Pending Verification</option>
                    <option>Verified</option>
                </select>
            </div>

            <div className="admin-card-grid">
                {loading ? (
                    <div className="loading-state">Loading volunteers...</div>
                ) : volunteers.length === 0 ? (
                    <div className="empty-state">
                        <User size={48} />
                        <p>No volunteers found</p>
                    </div>
                ) : (
                    volunteers.map(vol => (
                        <div key={vol._id} className="user-card">
                            <div className="user-card-header">
                                <div className="user-avatar">{vol.fullName.charAt(0)}</div>
                                <div className="user-info">
                                    <h3>{vol.fullName}</h3>
                                    <div className="trust-score">⭐ {vol.trustScore || 0} Trust Score</div>
                                </div>
                                <span className={`status-badge ${vol.verificationStatus}`}>{vol.verificationStatus}</span>
                            </div>
                            <div className="user-card-body">
                                <p>✉️ {vol.email}</p>
                                <p>📞 {vol.phone}</p>
                                <p>📍 {vol.address?.city || 'Unknown'}, {vol.address?.state || ''}</p>
                            </div>
                            <div className="user-card-stats">
                                <div className="stat-item">
                                    <h4>{vol.totalDeliveries || 0}</h4>
                                    <span>Deliveries</span>
                                </div>
                                <div className="stat-item">
                                    <h4>{vol.hasVehicle ? 'Yes' : 'No'}</h4>
                                    <span>Has Vehicle</span>
                                </div>
                            </div>
                            <div className="user-card-actions">
                                <button className="btn-verify">Verify</button>
                                <button className="btn-secondary">View Profile</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VolunteerManagement;
