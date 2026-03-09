import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getDashboardStats } from '../../api/admin';
import {
    Users, Handshake, Building2, Bike, Package, ClipboardList, Truck, Clock,
    ArrowRight, Activity, ShieldCheck, UserX, ChevronRight, TrendingUp
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, path, onClick }) => (
    <button
        onClick={onClick}
        className={`group relative w-full text-left p-5 rounded-xl bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-${color}/5 overflow-hidden`}
    >
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <span className="text-[13px] font-medium text-slate-400">{label}</span>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon size={20} className={`text-${color}-400`} />
            </div>
        </div>
        {path && (
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                <span>View details</span>
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
        )}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-${color}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
    </button>
);

const HealthCard = ({ label, value, status }) => {
    const config = {
        active: { color: 'emerald', icon: Activity },
        disabled: { color: 'red', icon: UserX },
        pending: { color: 'amber', icon: Clock },
    };
    const { color, icon: Icon } = config[status] || config.pending;
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className={`w-3 h-3 rounded-full bg-${color}-500 shadow-lg shadow-${color}-500/40 animate-pulse`} />
            <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                <Icon size={18} className={`text-${color}-400`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
            setUser(parsed);
        } else { navigate('/login'); return; }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await getDashboardStats(token);
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [navigate]);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading dashboard...</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'indigo', path: '/admin/users' },
        { label: 'Donors', value: stats?.totalDonors || 0, icon: Handshake, color: 'emerald', path: '/admin/users?role=donor' },
        { label: 'NGOs', value: stats?.totalNGOs || 0, icon: Building2, color: 'amber', path: '/admin/users?role=ngo' },
        { label: 'Volunteers', value: stats?.totalVolunteers || 0, icon: Bike, color: 'blue', path: '/admin/users?role=volunteer' },
        { label: 'Donations', value: stats?.totalDonations || 0, icon: Package, color: 'violet' },
        { label: 'Requests', value: stats?.totalRequests || 0, icon: ClipboardList, color: 'pink' },
        { label: 'Assignments', value: stats?.totalAssignments || 0, icon: Truck, color: 'teal' },
        { label: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: Clock, color: 'orange', path: '/admin/users?verification=pending' },
    ];

    const quickActions = [
        { label: 'Manage All Users', desc: 'View, edit, and manage user accounts', icon: Users, path: '/admin/users' },
        { label: 'Manage Donors', desc: 'Oversee donor accounts and activity', icon: Handshake, path: '/admin/users?role=donor' },
        { label: 'Manage NGOs', desc: 'Review and manage NGO organizations', icon: Building2, path: '/admin/users?role=ngo' },
        { label: 'Manage Volunteers', desc: 'Track volunteer availability & tasks', icon: Bike, path: '/admin/users?role=volunteer' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {getGreeting()}, {user?.fullName}!
                    </h1>
                    <p className="text-sm text-slate-400 mt-1.5">
                        Welcome to the admin control center. Here's your platform overview.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <ShieldCheck size={16} className="text-violet-400" />
                    <span className="text-sm font-medium text-violet-300">Admin</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <StatCard
                        key={i}
                        {...card}
                        onClick={() => card.path && navigate(card.path)}
                    />
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-900 transition-all duration-200 text-left"
                            >
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                    <Icon size={20} className="text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-white">{action.label}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Platform Health */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-emerald-400" />
                    Platform Health
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <HealthCard label="Active Users" value={stats?.activeUsers || 0} status="active" />
                    <HealthCard label="Disabled Users" value={stats?.disabledUsers || 0} status="disabled" />
                    <HealthCard label="Pending Verifications" value={stats?.pendingVerifications || 0} status="pending" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
