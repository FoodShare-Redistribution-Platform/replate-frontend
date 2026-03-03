import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import './Impact.css';

const Impact = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for impact metrics
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchImpactData = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                try {
                    const response = await fetch(`http://localhost:5001/api/impact/${parsedUser.role}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setMetrics(result.data);
                    } else {
                        console.error('Failed to fetch impact data');
                    }
                } catch (error) {
                    console.error('Error fetching impact data:', error);
                }
            }
            setLoading(false);
        };

        fetchImpactData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="loading">Loading impact data...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="impact-page">
                <div className="impact-header">
                    <h1>Your Impact Dashboard</h1>
                    <p className="subtitle">Track your contribution to sustainability and trust.</p>
                </div>

                {user?.role === 'donor' && metrics && (
                    <div className="impact-content">
                        <h2>Social Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-social">
                                <div className="metric-icon">🍱</div>
                                <div className="metric-value">{metrics.mealsDonated}</div>
                                <div className="metric-label">Meals Donated</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">🏢</div>
                                <div className="metric-value">{metrics.ngosServed}</div>
                                <div className="metric-label">NGOs Served</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">👥</div>
                                <div className="metric-value">{metrics.beneficiariesReached}</div>
                                <div className="metric-label">Beneficiaries Reached</div>
                            </div>
                        </div>

                        <h2>Environmental Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-enviro">
                                <div className="metric-icon">♻️</div>
                                <div className="metric-value">{metrics.foodWasteReduced} kg</div>
                                <div className="metric-label">Food Waste Reduced</div>
                            </div>
                            <div className="metric-card card-enviro">
                                <div className="metric-icon">🌍</div>
                                <div className="metric-value">{metrics.co2Saved} kg</div>
                                <div className="metric-label">CO₂ Emissions Saved</div>
                            </div>
                        </div>

                        <h2>Economic Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-econ">
                                <div className="metric-icon">💰</div>
                                <div className="metric-value">₹{metrics.valueCreated.toLocaleString()}</div>
                                <div className="metric-label">Est. Social Value Created</div>
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'ngo' && metrics && (
                    <div className="impact-content">
                        <h2>Distribution Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-social">
                                <div className="metric-icon">🍽️</div>
                                <div className="metric-value">{metrics.mealsReceived}</div>
                                <div className="metric-label">Meals Received</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">📍</div>
                                <div className="metric-value">{metrics.serviceCoverage}</div>
                                <div className="metric-label">Coverage Areas</div>
                            </div>
                        </div>

                        <h2>Efficiency Metrics</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">⚡</div>
                                <div className="metric-value">{metrics.avgResponseTime}</div>
                                <div className="metric-label">Avg Pickup Response</div>
                            </div>
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">📈</div>
                                <div className="metric-value">{metrics.utilizationRate}</div>
                                <div className="metric-label">Food Utilization Rate</div>
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'volunteer' && metrics && (
                    <div className="impact-content">
                        <h2>Volunteer Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-social">
                                <div className="metric-icon">📦</div>
                                <div className="metric-value">{metrics.pickupsCompleted}</div>
                                <div className="metric-label">Total Pickups Completed</div>
                            </div>
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">⏱️</div>
                                <div className="metric-value">{metrics.avgDeliveryTime}</div>
                                <div className="metric-label">Average Delivery Duration</div>
                            </div>
                            <div className="metric-card card-enviro">
                                <div className="metric-icon">✅</div>
                                <div className="metric-value">{metrics.onTimeDelivery}</div>
                                <div className="metric-label">On-time Delivery %</div>
                            </div>
                        </div>
                    </div>
                )}

                {user?.role === 'admin' && metrics && (
                    <div className="impact-content">
                        <h2>System-Wide Impact</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-admin">
                                <div className="metric-icon">🌐</div>
                                <div className="metric-value">{metrics.totalFoodRedistributed.toLocaleString()} kg</div>
                                <div className="metric-label">Total Food Redistributed</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">🍱</div>
                                <div className="metric-value">{metrics.totalMealsRecovered.toLocaleString()}</div>
                                <div className="metric-label">Total Meals Recovered</div>
                            </div>
                            <div className="metric-card card-enviro">
                                <div className="metric-icon">🌍</div>
                                <div className="metric-value">{metrics.totalCo2Saved?.toLocaleString() || 0} kg</div>
                                <div className="metric-label">Total CO₂ Saved</div>
                            </div>
                            <div className="metric-card card-econ">
                                <div className="metric-icon">💰</div>
                                <div className="metric-value">₹{metrics.totalValueCreated?.toLocaleString() || 0}</div>
                                <div className="metric-label">Total Value Created</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">🏢</div>
                                <div className="metric-value">{metrics.totalNgosServed || 0}</div>
                                <div className="metric-label">NGOs Served</div>
                            </div>
                            <div className="metric-card card-social">
                                <div className="metric-icon">🤝</div>
                                <div className="metric-value">{metrics.totalDonorsContributing || 0}</div>
                                <div className="metric-label">Active Donors</div>
                            </div>
                        </div>

                        <h2>Platform Health</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">👥</div>
                                <div className="metric-value">{metrics.activeStakeholders}</div>
                                <div className="metric-label">Active Stakeholders</div>
                            </div>
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">📈</div>
                                <div className="metric-value">{metrics.totalUsers || 0}</div>
                                <div className="metric-label">Total Registered Users</div>
                            </div>
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">⏳</div>
                                <div className="metric-value">{metrics.pendingDonations || 0}</div>
                                <div className="metric-label">Active Donations</div>
                            </div>
                            <div className="metric-card card-econ">
                                <div className="metric-icon">🛡️</div>
                                <div className="metric-value">{metrics.complianceViolationRate}</div>
                                <div className="metric-label">Compliance Violation Rate</div>
                            </div>
                        </div>

                        <h2>Operational Efficiency</h2>
                        <div className="metrics-grid">
                            <div className="metric-card card-efficiency">
                                <div className="metric-icon">📦</div>
                                <div className="metric-value">{metrics.totalPickupsCompleted || 0}</div>
                                <div className="metric-label">Total Pickups Completed</div>
                            </div>
                        </div>

                        <h2>User-Wise Impact Logs</h2>
                        <div className="user-logs-table-container">
                            <table className="user-logs-table">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Meals Donated</th>
                                        <th>Meals Received</th>
                                        <th>Pickups Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.userLogs?.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.name}</td>
                                            <td>{log.email}</td>
                                            <td><span className={`user-role-badge ${log.role}`}>{log.role}</span></td>
                                            <td>{log.mealsDonated > 0 ? log.mealsDonated : '-'}</td>
                                            <td>{log.mealsReceived > 0 ? log.mealsReceived : '-'}</td>
                                            <td>{log.pickupsCompleted > 0 ? log.pickupsCompleted : '-'}</td>
                                        </tr>
                                    ))}
                                    {(!metrics.userLogs || metrics.userLogs.length === 0) && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No impact logs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Impact;
