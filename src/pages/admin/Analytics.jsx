import React, { useState, useEffect } from 'react';

import { getAnalyticsStats } from '../../api/admin';
import { TrendingUp, Users, Heart, Clock, Award, Package, ShieldCheck } from 'lucide-react';
import './AdminPages.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('This Month');

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await getAnalyticsStats(token, timeRange);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch analytics stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-state">Loading Analytics...</div>;
    if (!stats) return <div className="error-state">Error loading analytics.</div>;

    return (
        <div className="admin-page-container analytics-container">
            <div className="admin-page-header">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p>Platform performance and impact metrics</p>
                </div>
                <div className="header-actions">
                    <select className="time-filter" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                        <option value="All Time">All Time</option>
                    </select>
                    <button className="refresh-btn" onClick={fetchStats}>
                        <Clock size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="analytics-kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <Package size={18} />
                        <span className="trend positive">↗ 12.5%</span>
                    </div>
                    <h3>{stats.totalDonations.toLocaleString()}</h3>
                    <p>Total Donations</p>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <Heart size={18} color="#e02424" />
                        <span className="trend positive">↗ 8.2%</span>
                    </div>
                    <h3>{stats.servingsDistributed.toLocaleString()}</h3>
                    <p>Servings Distributed</p>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <Users size={18} color="#7e3af2" />
                        <span className="trend positive">↗ 2.1%</span>
                    </div>
                    <h3>{stats.activeUsers.toLocaleString()}</h3>
                    <p>Active Users</p>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <TrendingUp size={18} color="#0e9f6e" />
                        <span className="trend positive">↗ 14.7%</span>
                    </div>
                    <h3>{stats.wasteReduced.toLocaleString()}kg</h3>
                    <p>Waste Reduced</p>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <Clock size={18} color="#ff5a1f" />
                        <span className="trend negative">↘ -5.4%</span>
                    </div>
                    <h3>{stats.avgDeliveryTime}min</h3>
                    <p>Avg Delivery Time</p>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <ShieldCheck size={18} color="#0694a2" />
                        <span className="trend positive">↗ 2.1%</span>
                    </div>
                    <h3>{stats.successRate}%</h3>
                    <p>Success Rate</p>
                </div>
            </div>

            {/* Charts Area (Mock representations based on screenshot) */}
            <div className="charts-grid">
                <div className="chart-card line-chart">
                    <h3>Weekly Donations</h3>
                    <p className="chart-subtitle">Daily donation trend</p>
                    <div className="chart-placeholder">
                        {/* In a real app, use recharts or chart.js here */}
                        <div className="mock-chart-line"></div>
                        <div className="mock-xaxis">
                            {stats.weeklyDonations.labels.map(L => <span key={L}>{L}</span>)}
                        </div>
                        <div className="mock-legend">
                            <span>320 <small>Total Donations</small></span>
                            <span>300 <small>Deliveries</small></span>
                            <span className="highlight-stat">15,500 <small>Servings</small></span>
                        </div>
                    </div>
                </div>
                <div className="chart-card pie-chart">
                    <h3>Food Type Distribution</h3>
                    <p className="chart-subtitle">Breakdown by food category</p>
                    <div className="chart-placeholder flex-row">
                        <div className="mock-circle">100%</div>
                        <div className="mock-legend-list">
                            {Object.entries(stats.foodTypeDistribution).map(([label, val]) => (
                                <div key={label} className="legend-item">
                                    <span className="dot"></span>
                                    <span>{label}</span>
                                    <span className="val">{val}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Lists Grid */}
            <div className="top-lists-grid">
                <div className="list-card">
                    <div className="list-header">
                        <h3>Top Donors</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <ul className="top-list">
                        {stats.topDonors.map((d, i) => (
                            <li key={i}>
                                <div className="rank">{i + 1}</div>
                                <div className="info">
                                    <strong>{d.name}</strong>
                                </div>
                                <div className={`badge ${(d.badge || 'bronze').toLowerCase()}`}>{d.badge || 'Bronze'}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="list-card">
                    <div className="list-header">
                        <h3>Top NGOs</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <ul className="top-list">
                        {stats.topNGOs.map((n, i) => (
                            <li key={i}>
                                <div className="rank">{i + 1}</div>
                                <div className="info">
                                    <strong>{n.name}</strong>
                                </div>
                                <div className={`badge ${(n.badge || 'verified').toLowerCase()}`}>{n.badge || 'Verified'}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="list-card">
                    <div className="list-header">
                        <h3>Top Volunteers</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <ul className="top-list">
                        {stats.topVolunteers.map((v, i) => (
                            <li key={i}>
                                <div className="rank">{i + 1}</div>
                                <div className="info">
                                    <strong>{v.name}</strong>
                                </div>
                                <div className="rating">
                                    <div className={`badge ${(v.badge || 'active').toLowerCase()}`}>{v.badge || 'Active'}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-card">
                <div className="list-header">
                    <h3>Recent Activity</h3>
                    <button className="view-all-btn">View All</button>
                </div>
                <ul className="activity-list">
                    {stats.recentActivity.map((act, i) => (
                        <li key={i}>
                            <div className="activity-icon"><Award size={16} /></div>
                            <div className="activity-text">{act.message}</div>
                            <div className="activity-time">{act.time}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Analytics;
