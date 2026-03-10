import React, { useState, useEffect } from 'react';
import { getAssignments } from '../../api/admin';
import { Clock, Truck } from 'lucide-react';
import './AdminPages.css';

const AdminAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All Status');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await getAssignments(token);
            setAssignments(data || []);
        } catch (err) {
            console.error("Failed to fetch assignments", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        inTransit: assignments.filter(a => ['accepted', 'in_transit', 'picked_up'].includes(a.status)).length,
        completed: assignments.filter(a => ['completed', 'delivered'].includes(a.status)).length
    };

    const filteredAssignments = assignments.filter(a => {
        if (statusFilter !== 'All Status' && a.status !== statusFilter) return false;
        return true;
    });

    const getStatusText = (status) => {
        if (!status) return 'Pending';
        if (status === 'in_transit') return 'In Transit';
        if (status === 'picked_up') return 'Picked Up';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) return <div className="loading-state">Loading Assignments...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <div>
                    <h1>Assignments</h1>
                    <p>Overview of all logistics and volunteer transport assignments across the platform</p>
                </div>
                <button
                    className="refresh-btn"
                    onClick={fetchAssignments}
                >
                    <Clock size={16} /> Refresh
                </button>
            </div>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Assignments</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-orange">{stats.pending}</div>
                    <div className="stat-label">Pending / Unassigned</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-blue">{stats.inTransit}</div>
                    <div className="stat-label">Active / In Transit</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value text-green">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            <div className="admin-filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All Status">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_transit">In Transit</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="completed">Completed / Delivered</option>
                </select>
            </div>

            <div className="admin-content-area">
                {loading ? (
                    <div className="loading-state">Loading assignments...</div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <Truck size={48} />
                        <p>No assignments found</p>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th>Task Type</th>
                                    <th>Food Item</th>
                                    <th>Donation Activity</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Pickup Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map(assignment => (
                                    <tr key={assignment._id}>
                                        <td>
                                            <div className="item-name">{assignment.type || 'Pickup'}</div>
                                            <div className="item-subtext">{new Date(assignment.createdAt || assignment.date).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <div className="item-name">{assignment.donation?.foodName || 'Unknown Food'}</div>
                                            <div className="item-subtext">{assignment.donation?.quantity} {assignment.donation?.unit}</div>
                                        </td>
                                        <td>
                                            <div className="item-name">From: {assignment.donor?.organizationName || assignment.donor?.fullName || 'Unknown Donor'}</div>
                                            <div className="item-subtext">To: {assignment.donation?.acceptedBy?.organizationName || assignment.donation?.acceptedBy?.fullName || 'Pending'}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${'status-' + (assignment.status || (statusFilter !== 'All Status' ? statusFilter : 'pending')).toLowerCase()}`}>
                                                {getStatusText(assignment.status || (statusFilter !== 'All Status' ? statusFilter : 'pending'))}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="item-name">{assignment.volunteer?.fullName || 'Unassigned'}</div>
                                            <div className="item-subtext">{assignment.volunteer?.phone || '--'}</div>
                                        </td>
                                        <td>
                                            <div className="item-name">{assignment.pickupAddress || assignment.donation?.pickupAddress || 'No Address'}</div>
                                            <div className="item-subtext">{assignment.donation?.city || '--'}</div>
                                        </td>
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

export default AdminAssignments;
