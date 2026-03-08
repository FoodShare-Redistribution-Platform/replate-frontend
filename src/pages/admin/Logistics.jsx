import React, { useState, useEffect } from 'react';

import { getAssignments } from '../../api/admin';
import { Truck, Navigation, Package, Clock } from 'lucide-react';
import './AdminPages.css';

const Logistics = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Deliveries');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getAssignments(token);
            setAssignments(data || []);
        } catch (err) {
            console.error("Failed to fetch logistics data", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: assignments.length,
        inTransit: assignments.filter(a => ['accepted', 'picked_up'].includes(a.status)).length,
        delivered: assignments.filter(a => a.status === 'delivered').length,
        avgDistance: '0km' // Needs real geocoding integration to compute
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>Logistics & Routing</h1>
                    <p>Manage deliveries, optimize routes, and track shipments</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Deliveries</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-blue">
                        <Navigation size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {stats.inTransit}
                    </div>
                    <div className="stat-label">In Transit</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-green">
                        <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>✔</span>
                        {stats.delivered}
                    </div>
                    <div className="stat-label">Delivered</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-purple">{stats.avgDistance}</div>
                    <div className="stat-label">Avg Distance</div>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'Deliveries' ? 'active' : ''} onClick={() => setActiveTab('Deliveries')}>Deliveries</button>
                <button className={activeTab === 'Route Planning' ? 'active' : ''} onClick={() => setActiveTab('Route Planning')}>Route Planning</button>
                <button className={activeTab === 'Live Tracking' ? 'active' : ''} onClick={() => setActiveTab('Live Tracking')}>Live Tracking</button>
            </div>

            <div className="admin-filters" style={{ marginTop: '20px' }}>
                <select>
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                </select>
            </div>

            <div className="admin-content-area logistics-area">
                {loading ? (
                    <div className="loading-state">Loading transport data...</div>
                ) : assignments.length === 0 ? (
                    <div className="empty-state">
                        <Truck size={48} />
                        <p className="empty-title">No Active Deliveries</p>
                        <p className="empty-sub">Deliveries will appear here once donations are matched and assigned</p>
                    </div>
                ) : (
                    <div className="data-table">
                        <p>{assignments.length} assignments tracked. Map integration can be displayed here in "Live Tracking" tab.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Logistics;
