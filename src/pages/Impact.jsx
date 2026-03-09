import React, { useState, useEffect } from 'react';
import './Impact.css';

const API_BASE = 'http://localhost:5001/api/impact';

const BADGE_STYLES = {
    platinum: { bg: 'linear-gradient(135deg, #E5E4E2, #B8B8B8)', border: '#E5E4E2', text: '#1e293b' },
    gold:     { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '#FFD700', text: '#1e293b' },
    silver:   { bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', border: '#C0C0C0', text: '#1e293b' },
    bronze:   { bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', border: '#CD7F32', text: '#fff' },
    none:     { bg: 'linear-gradient(135deg, #334155, #1e293b)', border: '#475569', text: '#94a3b8' }
};

const Impact = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [sustainability, setSustainability] = useState(null);
    const [trustBadge, setTrustBadge] = useState(null);
    const [trustGovernance, setTrustGovernance] = useState(null);
    const [susReport, setSusReport] = useState(null);
    const [adminActiveTab, setAdminActiveTab] = useState('impact');

    useEffect(() => {
        const fetchImpactData = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

                try {
                    // Fetch base impact metrics
                    const response = await fetch(`${API_BASE}/${parsedUser.role}`, { method: 'GET', headers });
                    if (response.ok) {
                        const result = await response.json();
                        setMetrics(result.data);
                    }

                    // Donor-specific: sustainability + trust badge
                    if (parsedUser.role === 'donor') {
                        const [susRes, badgeRes] = await Promise.all([
                            fetch(`${API_BASE}/donor/sustainability`, { method: 'GET', headers }),
                            fetch(`${API_BASE}/donor/trust-badge`, { method: 'GET', headers })
                        ]);
                        if (susRes.ok) {
                            const susData = await susRes.json();
                            setSustainability(susData.data);
                        }
                        if (badgeRes.ok) {
                            const badgeData = await badgeRes.json();
                            setTrustBadge(badgeData.data);
                        }
                    }

                    // NGO-specific: sustainability + trust badge
                    if (parsedUser.role === 'ngo') {
                        const [susRes, badgeRes] = await Promise.all([
                            fetch(`${API_BASE}/ngo/sustainability`, { method: 'GET', headers }),
                            fetch(`${API_BASE}/ngo/trust-badge`, { method: 'GET', headers })
                        ]);
                        if (susRes.ok) {
                            const susData = await susRes.json();
                            setSustainability(susData.data);
                        }
                        if (badgeRes.ok) {
                            const badgeData = await badgeRes.json();
                            setTrustBadge(badgeData.data);
                        }
                    }

                    // Volunteer-specific: sustainability + trust badge
                    if (parsedUser.role === 'volunteer') {
                        const [susRes, badgeRes] = await Promise.all([
                            fetch(`${API_BASE}/volunteer/sustainability`, { method: 'GET', headers }),
                            fetch(`${API_BASE}/volunteer/trust-badge`, { method: 'GET', headers })
                        ]);
                        if (susRes.ok) {
                            const susData = await susRes.json();
                            setSustainability(susData.data);
                        }
                        if (badgeRes.ok) {
                            const badgeData = await badgeRes.json();
                            setTrustBadge(badgeData.data);
                        }
                    }

                    // Admin-specific: trust governance + sustainability report
                    if (parsedUser.role === 'admin') {
                        const [govRes, reportRes] = await Promise.all([
                            fetch(`${API_BASE}/admin/trust-governance`, { method: 'GET', headers }),
                            fetch(`${API_BASE}/admin/sustainability-report`, { method: 'GET', headers })
                        ]);
                        if (govRes.ok) {
                            const govData = await govRes.json();
                            setTrustGovernance(govData.data);
                        }
                        if (reportRes.ok) {
                            const reportData = await reportRes.json();
                            setSusReport(reportData.data);
                        }
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
            <>
                <div className="loading">Loading impact data...</div>
            </>
        );
    }

    return (
        <>
            <div className="impact-page">
                <div className="impact-header">
                    <h1>Your Impact Dashboard</h1>
                    <p className="subtitle">Track your contribution to sustainability and trust.</p>
                </div>

                {user?.role === 'donor' && metrics && (
                    <div className="impact-content">
                        {/* ---- Trust Badge Section ---- */}
                        {trustBadge && (
                            <>
                                <h2>Your Trust Badge</h2>
                                <div className="trust-badge-section">
                                    <div className="trust-badge-card" style={{
                                        background: BADGE_STYLES[trustBadge.badgeLevel]?.bg,
                                        borderColor: BADGE_STYLES[trustBadge.badgeLevel]?.border
                                    }}>
                                        <div className="badge-icon-large">{trustBadge.badge.icon}</div>
                                        <div className="badge-info">
                                            <span className="badge-level" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.level}
                                            </span>
                                            <span className="badge-title" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.title}
                                            </span>
                                            <span className="badge-description" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text, opacity: 0.8 }}>
                                                {trustBadge.badge.description}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="badge-progress-card">
                                        <h3>Progress</h3>
                                        <div className="progress-items">
                                            <div className="progress-item">
                                                <span className="progress-label">Verification</span>
                                                <span className={`progress-status ${trustBadge.progress.verificationApproved ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.verificationApproved ? '✓ Approved' : '✗ Pending'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Delivered Donations</span>
                                                <span className="progress-value">{trustBadge.progress.deliveredDonations}</span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Hygiene Compliance</span>
                                                <span className="progress-value">{trustBadge.progress.hygieneCompliance}%</span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Spoilage Incidents</span>
                                                <span className={`progress-status ${trustBadge.progress.spoilageIncidents === 0 ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.spoilageIncidents}
                                                </span>
                                            </div>
                                        </div>
                                        {trustBadge.progress.nextBadge && (
                                            <div className="next-badge-hint">
                                                <strong>Next: {trustBadge.progress.nextBadge.level}</strong> — {trustBadge.progress.nextBadge.requirement}
                                            </div>
                                        )}
                                    </div>

                                    {/* All badge tiers overview */}
                                    <div className="badge-tiers-overview">
                                        <h3>Badge Tiers</h3>
                                        <div className="badge-tiers-grid">
                                            {[
                                                { level: 'bronze', icon: '🥉', name: 'Safe Contributor', desc: 'Verified + basic hygiene' },
                                                { level: 'silver', icon: '🥈', name: 'Verified Food Partner', desc: '10+ deliveries, zero spoilage' },
                                                { level: 'gold', icon: '🥇', name: 'Gold Sustainability Champion', desc: 'High volume + strict hygiene' },
                                                { level: 'platinum', icon: '💎', name: 'Community Impact Leader', desc: 'Top 10% in your city' }
                                            ].map(tier => (
                                                <div key={tier.level} className={`badge-tier-item ${trustBadge.badgeLevel === tier.level ? 'active' : ''} ${['platinum', 'gold', 'silver', 'bronze'].indexOf(trustBadge.badgeLevel) >= ['platinum', 'gold', 'silver', 'bronze'].indexOf(tier.level) && trustBadge.badgeLevel !== 'none' ? 'achieved' : ''}`}>
                                                    <span className="tier-icon">{tier.icon}</span>
                                                    <span className="tier-name">{tier.name}</span>
                                                    <span className="tier-desc">{tier.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

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

                        {/* ---- Sustainability Dashboard ---- */}
                        {sustainability && (
                            <>
                                <h2>Sustainability Dashboard</h2>

                                {/* Sustainability Score */}
                                <div className="sustainability-score-section">
                                    <div className="score-ring-container">
                                        <div className="score-ring">
                                            <svg viewBox="0 0 120 120" className="score-svg">
                                                <circle cx="60" cy="60" r="52" fill="none" stroke="#334155" strokeWidth="8" />
                                                <circle cx="60" cy="60" r="52" fill="none"
                                                    stroke={sustainability.sustainabilityScore >= 90 ? '#10b981' : sustainability.sustainabilityScore >= 70 ? '#3b82f6' : sustainability.sustainabilityScore >= 50 ? '#f59e0b' : '#ef4444'}
                                                    strokeWidth="8"
                                                    strokeDasharray={`${(sustainability.sustainabilityScore / 100) * 327} 327`}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 60 60)"
                                                />
                                                <text x="60" y="55" textAnchor="middle" fill="#f1f5f9" fontSize="24" fontWeight="700">
                                                    {sustainability.sustainabilityScore}
                                                </text>
                                                <text x="60" y="75" textAnchor="middle" fill="#94a3b8" fontSize="10">
                                                    {sustainability.sustainabilityTier}
                                                </text>
                                            </svg>
                                        </div>
                                        <div className="score-breakdown">
                                            <div className="breakdown-item"><span>Total Donations</span><strong>{sustainability.breakdown.totalDonations}</strong></div>
                                            <div className="breakdown-item"><span>Delivered</span><strong className="text-green">{sustainability.breakdown.delivered}</strong></div>
                                            <div className="breakdown-item"><span>Expired</span><strong className="text-red">{sustainability.breakdown.expired}</strong></div>
                                            <div className="breakdown-item"><span>Cancelled</span><strong className="text-red">{sustainability.breakdown.cancelled}</strong></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Trends */}
                                {sustainability.monthlyTrends.length > 0 && (
                                    <>
                                        <h3 className="subsection-title">Monthly Donation Trends</h3>
                                        <div className="trends-chart">
                                            <div className="bar-chart">
                                                {sustainability.monthlyTrends.map((m, i) => {
                                                    const maxDonations = Math.max(...sustainability.monthlyTrends.map(t => t.donations));
                                                    const height = maxDonations > 0 ? (m.donations / maxDonations) * 100 : 0;
                                                    return (
                                                        <div key={i} className="bar-group">
                                                            <div className="bar-tooltip">{m.donations} donations<br />{m.servings} servings</div>
                                                            <div className="bar" style={{ height: `${Math.max(height, 5)}%` }}></div>
                                                            <span className="bar-label">{m.month}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Yearly Impact Graph */}
                                {sustainability.yearlyImpact.length > 0 && (
                                    <>
                                        <h3 className="subsection-title">Yearly Impact Overview</h3>
                                        <div className="yearly-impact-grid">
                                            {sustainability.yearlyImpact.map((y, i) => (
                                                <div key={i} className="yearly-card">
                                                    <div className="yearly-year">{y.year}</div>
                                                    <div className="yearly-stats">
                                                        <div><span className="yearly-stat-label">Donations</span><strong>{y.donations}</strong></div>
                                                        <div><span className="yearly-stat-label">Waste Reduced</span><strong>{y.foodWasteReduced} kg</strong></div>
                                                        <div><span className="yearly-stat-label">CO₂ Saved</span><strong>{y.co2Saved} kg</strong></div>
                                                        <div><span className="yearly-stat-label">Servings</span><strong>{y.servings}</strong></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* City Leaderboard */}
                                {sustainability.leaderboard.length > 0 && (
                                    <>
                                        <h3 className="subsection-title">
                                            Contribution Ranking — {sustainability.city}
                                            {sustainability.myRank && <span className="my-rank-badge">Your Rank: #{sustainability.myRank}</span>}
                                        </h3>
                                        <div className="leaderboard-table-container">
                                            <table className="leaderboard-table">
                                                <thead>
                                                    <tr>
                                                        <th>Rank</th>
                                                        <th>Donor</th>
                                                        <th>Delivered</th>
                                                        <th>Servings</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sustainability.leaderboard.map(entry => (
                                                        <tr key={entry.rank} className={entry.isCurrentUser ? 'highlight-row' : ''}>
                                                            <td>
                                                                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                                                            </td>
                                                            <td>{entry.name} {entry.isCurrentUser && <span className="you-tag">You</span>}</td>
                                                            <td>{entry.deliveredCount}</td>
                                                            <td>{entry.totalServings}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {user?.role === 'ngo' && metrics && (
                    <div className="impact-content">
                        {/* ---- NGO Trust Badge ---- */}
                        {trustBadge && (
                            <>
                                <h2>Your Trust Badge</h2>
                                <div className="trust-badge-section">
                                    <div className="trust-badge-card" style={{
                                        background: BADGE_STYLES[trustBadge.badgeLevel]?.bg,
                                        borderColor: BADGE_STYLES[trustBadge.badgeLevel]?.border
                                    }}>
                                        <div className="badge-icon-large">{trustBadge.badge.icon}</div>
                                        <div className="badge-info">
                                            <span className="badge-level" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.level}
                                            </span>
                                            <span className="badge-title" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.title}
                                            </span>
                                            <span className="badge-description" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text, opacity: 0.8 }}>
                                                {trustBadge.badge.description}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="badge-progress-card">
                                        <h3>Progress</h3>
                                        <div className="progress-items">
                                            <div className="progress-item">
                                                <span className="progress-label">Verification</span>
                                                <span className={`progress-status ${trustBadge.progress.verificationApproved ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.verificationApproved ? '✓ Approved' : '✗ Pending'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Delivered</span>
                                                <span className="progress-value">{trustBadge.progress.deliveredDonations}</span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Avg Acceptance</span>
                                                <span className={`progress-status ${trustBadge.progress.fastAcceptance ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.avgAcceptanceMins != null ? `${trustBadge.progress.avgAcceptanceMins} min` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Strict Reporting</span>
                                                <span className={`progress-status ${trustBadge.progress.strictReporting ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.strictReporting ? '✓ Yes' : '✗ No'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Capacity Utilization</span>
                                                <span className={`progress-status ${trustBadge.progress.highCapacity ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.capacityUtilization}%
                                                </span>
                                            </div>
                                        </div>
                                        {trustBadge.progress.nextBadge && (
                                            <div className="next-badge-hint">
                                                <strong>Next: {trustBadge.progress.nextBadge.level}</strong> — {trustBadge.progress.nextBadge.requirement}
                                            </div>
                                        )}
                                    </div>

                                    {/* NGO Badge Tiers */}
                                    <div className="badge-tiers-overview">
                                        <h3>Badge Tiers</h3>
                                        <div className="badge-tiers-grid">
                                            {[
                                                { level: 'bronze', icon: '🥉', name: 'Verified Relief Partner', desc: 'Verification approved' },
                                                { level: 'silver', icon: '🥈', name: 'Trusted Community Distributor', desc: 'Fast acceptance + strict reporting' },
                                                { level: 'gold', icon: '🥇', name: 'High Impact NGO', desc: 'High capacity utilization' }
                                            ].map(tier => (
                                                <div key={tier.level} className={`badge-tier-item ${trustBadge.badgeLevel === tier.level ? 'active' : ''} ${['gold', 'silver', 'bronze'].indexOf(trustBadge.badgeLevel) >= 0 && ['gold', 'silver', 'bronze'].indexOf(trustBadge.badgeLevel) <= ['gold', 'silver', 'bronze'].indexOf(tier.level) ? 'achieved' : ''}`}>
                                                    <span className="tier-icon">{tier.icon}</span>
                                                    <span className="tier-name">{tier.name}</span>
                                                    <span className="tier-desc">{tier.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

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

                        {/* ---- NGO Sustainability Contribution ---- */}
                        {sustainability && (
                            <>
                                <h2>Sustainability Contribution</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">♻️</div>
                                        <div className="metric-value">{sustainability.wastePreventedKg} kg</div>
                                        <div className="metric-label">Food Waste Prevented</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">🌍</div>
                                        <div className="metric-value">{sustainability.totalCo2Saved} kg</div>
                                        <div className="metric-label">CO₂ Emissions Saved</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">⏱️</div>
                                        <div className="metric-value">{sustainability.rapidAcceptanceRate}%</div>
                                        <div className="metric-label">Saved Before Expiry</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">📍</div>
                                        <div className="metric-value">{sustainability.localMatchRate}%</div>
                                        <div className="metric-label">Local Match Rate</div>
                                    </div>
                                </div>

                                {/* Sustainability Detail Cards */}
                                <div className="ngo-sustainability-details">
                                    <div className="sus-detail-card">
                                        <h3>Waste Prevention</h3>
                                        <p className="sus-detail-stat">{sustainability.totalDelivered} donations</p>
                                        <p className="sus-detail-desc">
                                            Rapidly accepted and redistributed before expiry, preventing <strong>{sustainability.wastePreventedKg} kg</strong> of food waste from reaching landfills.
                                        </p>
                                        <div className="sus-progress-bar">
                                            <div className="sus-progress-fill" style={{ width: `${sustainability.rapidAcceptanceRate}%` }}></div>
                                        </div>
                                        <span className="sus-progress-label">{sustainability.rapidAcceptanceRate}% delivered before expiry</span>
                                    </div>

                                    <div className="sus-detail-card">
                                        <h3>Localized Impact</h3>
                                        <p className="sus-detail-stat">{sustainability.localMatchCount} local pickups</p>
                                        <p className="sus-detail-desc">
                                            CO₂ reduced through localized donor-NGO matching within the same area.
                                            Local matches earn a <strong>15% CO₂ bonus</strong> from reduced transport emissions.
                                        </p>
                                        <div className="sus-progress-bar">
                                            <div className="sus-progress-fill local" style={{ width: `${sustainability.localMatchRate}%` }}></div>
                                        </div>
                                        <span className="sus-progress-label">{sustainability.localMatchRate}% locally matched</span>
                                    </div>

                                    {sustainability.capacityUtilization !== null && (
                                        <div className="sus-detail-card">
                                            <h3>Capacity Utilization</h3>
                                            <p className="sus-detail-stat">{sustainability.avgDailyReceived} / {sustainability.dailyCapacity} daily</p>
                                            <p className="sus-detail-desc">
                                                Avg daily servings received vs. declared daily capacity over the last 30 days.
                                            </p>
                                            <div className="sus-progress-bar">
                                                <div className="sus-progress-fill capacity" style={{ width: `${sustainability.capacityUtilization}%` }}></div>
                                            </div>
                                            <span className="sus-progress-label">{sustainability.capacityUtilization}% capacity utilized</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {user?.role === 'volunteer' && metrics && (
                    <div className="impact-content">
                        {/* ---- Volunteer Trust Badge ---- */}
                        {trustBadge && (
                            <>
                                <h2>Your Trust Badge</h2>
                                <div className="trust-badge-section">
                                    <div className="trust-badge-card" style={{
                                        background: BADGE_STYLES[trustBadge.badgeLevel]?.bg,
                                        borderColor: BADGE_STYLES[trustBadge.badgeLevel]?.border
                                    }}>
                                        <div className="badge-icon-large">{trustBadge.badge.icon}</div>
                                        <div className="badge-info">
                                            <span className="badge-level" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.level}
                                            </span>
                                            <span className="badge-title" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text }}>
                                                {trustBadge.badge.title}
                                            </span>
                                            <span className="badge-description" style={{ color: BADGE_STYLES[trustBadge.badgeLevel]?.text, opacity: 0.8 }}>
                                                {trustBadge.badge.description}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="badge-progress-card">
                                        <h3>Progress</h3>
                                        <div className="progress-items">
                                            <div className="progress-item">
                                                <span className="progress-label">Availability</span>
                                                <span className={`progress-status ${trustBadge.progress.isAvailable ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.isAvailable ? '✓ Active' : '✗ Inactive'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Completed</span>
                                                <span className="progress-value">{trustBadge.progress.completedDeliveries}</span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Avg Acceptance</span>
                                                <span className={`progress-status ${trustBadge.progress.rapidAcceptance ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.avgAcceptanceMins != null ? `${trustBadge.progress.avgAcceptanceMins} min` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Avg Rating</span>
                                                <span className={`progress-status ${trustBadge.progress.highRating ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.avgRating > 0 ? `${trustBadge.progress.avgRating} / 5` : 'N/A'}
                                                    {trustBadge.progress.ratedCount > 0 && ` (${trustBadge.progress.ratedCount} ratings)`}
                                                </span>
                                            </div>
                                            <div className="progress-item">
                                                <span className="progress-label">Cancellation Rate</span>
                                                <span className={`progress-status ${trustBadge.progress.lowCancellation ? 'pass' : 'fail'}`}>
                                                    {trustBadge.progress.cancellationRate}%
                                                </span>
                                            </div>
                                        </div>
                                        {trustBadge.progress.nextBadge && (
                                            <div className="next-badge-hint">
                                                <strong>Next: {trustBadge.progress.nextBadge.level}</strong> — {trustBadge.progress.nextBadge.requirement}
                                            </div>
                                        )}
                                    </div>

                                    {/* Volunteer Badge Tiers */}
                                    <div className="badge-tiers-overview">
                                        <h3>Badge Tiers</h3>
                                        <div className="badge-tiers-grid">
                                            {[
                                                { level: 'bronze', icon: '🥉', name: 'Reliable Volunteer', desc: 'Available + successful deliveries' },
                                                { level: 'silver', icon: '🥈', name: 'Priority Responder', desc: 'Rapid acceptance, low cancellations' },
                                                { level: 'gold', icon: '🥇', name: 'Gold Service Champion', desc: '4.5+ avg rating, 10+ deliveries' }
                                            ].map(tier => (
                                                <div key={tier.level} className={`badge-tier-item ${trustBadge.badgeLevel === tier.level ? 'active' : ''} ${['gold', 'silver', 'bronze'].indexOf(trustBadge.badgeLevel) >= 0 && ['gold', 'silver', 'bronze'].indexOf(trustBadge.badgeLevel) <= ['gold', 'silver', 'bronze'].indexOf(tier.level) ? 'achieved' : ''}`}>
                                                    <span className="tier-icon">{tier.icon}</span>
                                                    <span className="tier-name">{tier.name}</span>
                                                    <span className="tier-desc">{tier.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

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

                        {/* ---- Volunteer Sustainability Metrics ---- */}
                        {sustainability && (
                            <>
                                <h2>Sustainability Metrics</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">🛰️</div>
                                        <div className="metric-value">{sustainability.routingCompliance}%</div>
                                        <div className="metric-label">Routing Compliance</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">🌍</div>
                                        <div className="metric-value">{sustainability.co2SavedKg} kg</div>
                                        <div className="metric-label">CO₂ Saved</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">✅</div>
                                        <div className="metric-value">{sustainability.successRate}%</div>
                                        <div className="metric-label">Success Rate</div>
                                    </div>
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">📋</div>
                                        <div className="metric-value">{sustainability.recentCompletions}</div>
                                        <div className="metric-label">Last 30 Days Completed</div>
                                    </div>
                                </div>

                                <div className="ngo-sustainability-details">
                                    <div className="sus-detail-card">
                                        <h3>Fuel-Efficient Routing</h3>
                                        <p className="sus-detail-stat">{sustainability.locationUpdates} / {sustainability.totalTransitAssignments} tracked</p>
                                        <p className="sus-detail-desc">
                                            Location updates shared during transit. Consistent tracking enables <strong>fuel-efficient routing</strong> and reduces unnecessary mileage.
                                        </p>
                                        <div className="sus-progress-bar">
                                            <div className="sus-progress-fill local" style={{ width: `${sustainability.routingCompliance}%` }}></div>
                                        </div>
                                        <span className="sus-progress-label">{sustainability.routingCompliance}% routing compliance</span>
                                    </div>

                                    <div className="sus-detail-card">
                                        <h3>Failed Pickup Reduction</h3>
                                        <p className="sus-detail-stat">{sustainability.failedPickupCount} failed pickups</p>
                                        <p className="sus-detail-desc">
                                            Post-acceptance cancellations with a reason. Target: <strong>zero</strong> failed pickups after accepting an assignment.
                                        </p>
                                        <div className="sus-progress-bar">
                                            <div className="sus-progress-fill" style={{ width: `${sustainability.successRate}%` }}></div>
                                        </div>
                                        <span className="sus-progress-label">{sustainability.successRate}% delivery success rate</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {user?.role === 'admin' && metrics && (
                    <div className="impact-content">
                        {/* Admin Tab Navigation */}
                        <div className="admin-tabs">
                            <button className={`admin-tab ${adminActiveTab === 'impact' ? 'active' : ''}`} onClick={() => setAdminActiveTab('impact')}>System Impact</button>
                            <button className={`admin-tab ${adminActiveTab === 'governance' ? 'active' : ''}`} onClick={() => setAdminActiveTab('governance')}>Trust Governance</button>
                            <button className={`admin-tab ${adminActiveTab === 'report' ? 'active' : ''}`} onClick={() => setAdminActiveTab('report')}>Sustainability Report</button>
                        </div>

                        {/* ========== TAB: System Impact ========== */}
                        {adminActiveTab === 'impact' && (
                            <>
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
                            </>
                        )}

                        {/* ========== TAB: Trust Governance ========== */}
                        {adminActiveTab === 'governance' && trustGovernance && (
                            <>
                                <h2>Trust Score Overview</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card card-admin">
                                        <div className="metric-icon">🎯</div>
                                        <div className="metric-value">{trustGovernance.avgTrustScore}</div>
                                        <div className="metric-label">Platform Avg Trust Score</div>
                                    </div>
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">👥</div>
                                        <div className="metric-value">{trustGovernance.totalUsersScored}</div>
                                        <div className="metric-label">Users Scored</div>
                                    </div>
                                    <div className="metric-card card-econ">
                                        <div className="metric-icon">⚠️</div>
                                        <div className="metric-value">{trustGovernance.auditFlags.length}</div>
                                        <div className="metric-label">Audit Flags</div>
                                    </div>
                                </div>

                                {/* Badge Distribution */}
                                <h2>Badge Distribution</h2>
                                <div className="badge-distribution">
                                    {[
                                        { key: 'platinum', label: 'Platinum', icon: '💎', color: '#E5E4E2' },
                                        { key: 'gold', label: 'Gold', icon: '🥇', color: '#FFD700' },
                                        { key: 'silver', label: 'Silver', icon: '🥈', color: '#C0C0C0' },
                                        { key: 'bronze', label: 'Bronze', icon: '🥉', color: '#CD7F32' },
                                        { key: 'none', label: 'No Badge', icon: '🔒', color: '#64748b' }
                                    ].map(b => (
                                        <div key={b.key} className="badge-dist-item">
                                            <span className="badge-dist-icon">{b.icon}</span>
                                            <span className="badge-dist-count" style={{ color: b.color }}>{trustGovernance.badgeDistribution[b.key] || 0}</span>
                                            <span className="badge-dist-label">{b.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Trust Score Algorithm Visibility */}
                                <h2>Trust Score Algorithm</h2>
                                <div className="algorithm-card">
                                    <div className="algo-formula">
                                        Trust Score = (Compliance × 0.4) + (Reliability × 0.3) + (Feedback × 0.2) + (Consistency × 0.1)
                                    </div>
                                    <div className="algo-breakdown">
                                        <div className="algo-factor"><span className="algo-weight">40%</span><span className="algo-name">Compliance</span><span className="algo-desc">Hygiene checklists, timestamp updates, location sharing</span></div>
                                        <div className="algo-factor"><span className="algo-weight">30%</span><span className="algo-name">Reliability</span><span className="algo-desc">Delivery/acceptance ratio, no expired pending donations</span></div>
                                        <div className="algo-factor"><span className="algo-weight">20%</span><span className="algo-name">Feedback</span><span className="algo-desc">Assignment ratings (1-5 scale)</span></div>
                                        <div className="algo-factor"><span className="algo-weight">10%</span><span className="algo-name">Consistency</span><span className="algo-desc">Regular activity frequency over rolling 6-month window</span></div>
                                    </div>
                                </div>

                                {/* User Trust Scores Table */}
                                <h2>User Trust Scores</h2>
                                <div className="user-logs-table-container">
                                    <table className="user-logs-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Role</th>
                                                <th>Score</th>
                                                <th>Badge</th>
                                                <th>Compliance</th>
                                                <th>Reliability</th>
                                                <th>Feedback</th>
                                                <th>Consistency</th>
                                                <th>Verification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trustGovernance.trustScores.map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.name}</td>
                                                    <td><span className={`user-role-badge ${u.role}`}>{u.role}</span></td>
                                                    <td>
                                                        <span className={`trust-score-pill ${u.trustScore >= 70 ? 'high' : u.trustScore >= 40 ? 'medium' : 'low'}`}>
                                                            {u.trustScore}
                                                        </span>
                                                    </td>
                                                    <td><span className={`badge-level-tag ${u.badgeLevel}`}>{u.badgeLevel}</span></td>
                                                    <td>{u.breakdown.compliance}%</td>
                                                    <td>{u.breakdown.reliability}%</td>
                                                    <td>{u.breakdown.feedback}%</td>
                                                    <td>{u.breakdown.consistency}%</td>
                                                    <td><span className={`verification-tag ${u.verificationStatus}`}>{u.verificationStatus}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Fraud Detection & Audit */}
                                {trustGovernance.auditFlags.length > 0 && (
                                    <>
                                        <h2>Fraud Detection & Audit Flags</h2>
                                        <div className="audit-flags-container">
                                            {trustGovernance.auditFlags.map((flag, idx) => (
                                                <div key={idx} className="audit-flag-card">
                                                    <div className="audit-flag-header">
                                                        <span className="audit-flag-icon">⚠️</span>
                                                        <span className="audit-flag-id">Assignment #{flag.assignmentId.slice(-6)}</span>
                                                        <span className={`audit-status-tag ${flag.status}`}>{flag.status}</span>
                                                    </div>
                                                    <div className="audit-flag-body">
                                                        {flag.volunteer && <div className="audit-detail"><strong>Volunteer:</strong> {flag.volunteer.name} ({flag.volunteer.email})</div>}
                                                        {flag.donation && <div className="audit-detail"><strong>Donation:</strong> {flag.donation.name} [{flag.donation.status}]</div>}
                                                        <div className="audit-flags-list">
                                                            {flag.flags.map((f, i) => (
                                                                <span key={i} className="audit-flag-tag">{f}</span>
                                                            ))}
                                                        </div>
                                                        <div className="audit-timestamps">
                                                            {flag.timestamps.assignedAt && <span>Assigned: {new Date(flag.timestamps.assignedAt).toLocaleString()}</span>}
                                                            {flag.timestamps.acceptedAt && <span>Accepted: {new Date(flag.timestamps.acceptedAt).toLocaleString()}</span>}
                                                            {flag.timestamps.startedAt && <span>Started: {new Date(flag.timestamps.startedAt).toLocaleString()}</span>}
                                                            {flag.timestamps.completedAt && <span>Completed: {new Date(flag.timestamps.completedAt).toLocaleString()}</span>}
                                                            {flag.timestamps.cancelledAt && <span>Cancelled: {new Date(flag.timestamps.cancelledAt).toLocaleString()}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* ========== TAB: Sustainability Report ========== */}
                        {adminActiveTab === 'report' && susReport && (
                            <>
                                <div className="report-header-bar">
                                    <div>
                                        <h2>{susReport.reportMeta.reportType}</h2>
                                        <p className="report-meta">
                                            {new Date(susReport.reportMeta.periodStart).toLocaleDateString()} — {new Date(susReport.reportMeta.periodEnd).toLocaleDateString()}
                                            &nbsp;·&nbsp;Generated {new Date(susReport.reportMeta.generatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button className="export-btn" onClick={() => {
                                        const blob = new Blob([JSON.stringify(susReport, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `replate-sustainability-report-${new Date().toISOString().slice(0, 10)}.json`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}>Export JSON</button>
                                </div>

                                {/* ESG Summary Totals */}
                                <h2>Period Summary</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">♻️</div>
                                        <div className="metric-value">{susReport.totals.foodWasteReducedKg} kg</div>
                                        <div className="metric-label">Food Waste Diverted</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">🌍</div>
                                        <div className="metric-value">{susReport.totals.co2SavedKg} kg</div>
                                        <div className="metric-label">CO₂ Emissions Saved</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">💧</div>
                                        <div className="metric-value">{susReport.totals.waterSavedLiters?.toLocaleString()} L</div>
                                        <div className="metric-label">Water Footprint Saved</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">🟢</div>
                                        <div className="metric-value">{susReport.totals.landfillDiversionKg} kg</div>
                                        <div className="metric-label">Landfill Diversion</div>
                                    </div>
                                    <div className="metric-card card-econ">
                                        <div className="metric-icon">💰</div>
                                        <div className="metric-value">₹{susReport.totals.economicValue?.toLocaleString()}</div>
                                        <div className="metric-label">Economic Value Created</div>
                                    </div>
                                    <div className="metric-card card-social">
                                        <div className="metric-icon">🍽️</div>
                                        <div className="metric-value">{susReport.totals.deliveredServings?.toLocaleString()}</div>
                                        <div className="metric-label">Servings Delivered</div>
                                    </div>
                                </div>

                                {/* Donation success metrics */}
                                <div className="metrics-grid">
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">📦</div>
                                        <div className="metric-value">{susReport.totals.totalDonations}</div>
                                        <div className="metric-label">Total Donations</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">✅</div>
                                        <div className="metric-value">{susReport.totals.delivered}</div>
                                        <div className="metric-label">Delivered</div>
                                    </div>
                                    <div className="metric-card card-admin">
                                        <div className="metric-icon">❌</div>
                                        <div className="metric-value">{susReport.totals.cancelled}</div>
                                        <div className="metric-label">Cancelled</div>
                                    </div>
                                    <div className="metric-card card-admin">
                                        <div className="metric-icon">⏰</div>
                                        <div className="metric-value">{susReport.totals.expired}</div>
                                        <div className="metric-label">Expired</div>
                                    </div>
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">🎯</div>
                                        <div className="metric-value">{susReport.totals.successRate}%</div>
                                        <div className="metric-label">Overall Success Rate</div>
                                    </div>
                                </div>

                                {/* Stakeholder Breakdown */}
                                <h2>Active Stakeholders</h2>
                                <div className="badge-distribution">
                                    {Object.entries(susReport.stakeholderBreakdown).map(([role, count]) => (
                                        <div key={role} className="badge-dist-item">
                                            <span className="badge-dist-icon">{role === 'donor' ? '🏢' : role === 'ngo' ? '🏥' : '🚚'}</span>
                                            <span className="badge-dist-count">{count}</span>
                                            <span className="badge-dist-label">{role}s</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Assignment Metrics */}
                                <h2>Assignment Metrics</h2>
                                <div className="metrics-grid">
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">📝</div>
                                        <div className="metric-value">{susReport.assignmentMetrics.total}</div>
                                        <div className="metric-label">Total Assignments</div>
                                    </div>
                                    <div className="metric-card card-enviro">
                                        <div className="metric-icon">✅</div>
                                        <div className="metric-value">{susReport.assignmentMetrics.completed}</div>
                                        <div className="metric-label">Completed</div>
                                    </div>
                                    <div className="metric-card card-admin">
                                        <div className="metric-icon">❌</div>
                                        <div className="metric-value">{susReport.assignmentMetrics.cancelled}</div>
                                        <div className="metric-label">Cancelled</div>
                                    </div>
                                    <div className="metric-card card-efficiency">
                                        <div className="metric-icon">📈</div>
                                        <div className="metric-value">{susReport.assignmentMetrics.successRate}%</div>
                                        <div className="metric-label">Success Rate</div>
                                    </div>
                                </div>

                                {/* Monthly Breakdown Table */}
                                <h2>Monthly Breakdown</h2>
                                <div className="user-logs-table-container">
                                    <table className="user-logs-table">
                                        <thead>
                                            <tr>
                                                <th>Period</th>
                                                <th>Donations</th>
                                                <th>Delivered</th>
                                                <th>Success %</th>
                                                <th>Servings</th>
                                                <th>Waste Reduced (kg)</th>
                                                <th>CO₂ Saved (kg)</th>
                                                <th>Value (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {susReport.monthlyReport.map((m, i) => (
                                                <tr key={i}>
                                                    <td><strong>{m.period}</strong></td>
                                                    <td>{m.totalDonations}</td>
                                                    <td>{m.delivered}</td>
                                                    <td><span className={`trust-score-pill ${m.successRate >= 70 ? 'high' : m.successRate >= 40 ? 'medium' : 'low'}`}>{m.successRate}%</span></td>
                                                    <td>{m.deliveredServings.toLocaleString()}</td>
                                                    <td>{m.foodWasteReducedKg}</td>
                                                    <td>{m.co2SavedKg}</td>
                                                    <td>₹{m.economicValue.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Impact;
