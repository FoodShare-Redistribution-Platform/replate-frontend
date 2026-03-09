import React, { useState, useEffect } from 'react';

import { getUsers } from '../../api/admin';
import { Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import './AdminPages.css';

const NGOManagement = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNgos();
    }, []);

    const fetchNgos = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getUsers(token, { role: 'ngo' });
            setNgos(data.users || []);
        } catch (err) {
            console.error("Failed to fetch NGOs", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: ngos.length,
        verified: ngos.filter(n => n.verificationStatus === 'approved').length,
        active: ngos.filter(n => n.status === 'active').length,
        donationsReceived: 0 // Mock for now
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>NGO Management</h1>
                    <p>Manage partner NGOs, shelters, and community kitchens</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total NGOs</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-green">{stats.verified}</div>
                    <div className="stat-label">Verified</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-blue">{stats.active}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-purple">{stats.donationsReceived}</div>
                    <div className="stat-label">Donations Received</div>
                </div>
            </div>

            <div className="admin-filters">
                <select>
                    <option>All NGOs</option>
                    <option>Verified</option>
                    <option>Pending Verification</option>
                </select>
            </div>

            <div className="admin-card-grid">
                {loading ? (
                    <div className="loading-state">Loading NGOs...</div>
                ) : ngos.length === 0 ? (
                    <div className="empty-state">
                        <Building2 size={48} />
                        <p>No NGOs found</p>
                    </div>
                ) : (
                    ngos.map(ngo => (
                        <div key={ngo._id} className="user-card ngo-card">
                            <div className="user-card-header">
                                <div className="user-avatar ngo-avatar"><Building2 size={24} /></div>
                                <div className="user-info">
                                    <h3>{ngo.organizationName || ngo.fullName}</h3>
                                    <div className="trust-score">⭐ {ngo.trustScore || 0} Trust Score</div>
                                </div>
                                <span className={`status-badge ${ngo.verificationStatus}`}>{ngo.verificationStatus}</span>
                            </div>
                            <div className="user-card-body two-columns">
                                <div className="info-col">
                                    <p><Mail size={14} /> {ngo.email}</p>
                                    <p><Phone size={14} /> {ngo.phone}</p>
                                </div>
                                <div className="info-col">
                                    <p><MapPin size={14} /> {ngo.address?.city || 'Unknown'}, {ngo.address?.state || ''}</p>
                                    <p>🕒 Since {new Date(ngo.createdAt).getFullYear()}</p>
                                </div>
                            </div>
                            <div className="user-card-stats">
                                <div className="stat-item">
                                    <h4>{0}</h4>
                                    <span>Received</span>
                                </div>
                                <div className="stat-item">
                                    <h4>⭐ {ngo.trustScore || 0}</h4>
                                    <span>Trust Score</span>
                                </div>
                                <div className="stat-item">
                                    <h4>{ngo.badges?.length > 0 ? ngo.badges[ngo.badges.length - 1].name : 'None'}</h4>
                                    <span>Badge</span>
                                </div>
                            </div>
                            <div className="user-card-actions">
                                <button className="btn-verify">Verify</button>
                                <button className="btn-secondary">View Details</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NGOManagement;
