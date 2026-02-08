import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus, updateVerificationStatus } from '../../api/admin';
import {
    Users, Handshake, Building2, Bike, Shield, Search, Plus,
    Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronLeft,
    ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft, CheckCircle2,
    XCircle, Loader2, UserPlus
} from 'lucide-react';

const ROLE_CONFIG = {
    all: { label: 'All Users', icon: Users, color: 'indigo' },
    donor: { label: 'Donors', icon: Handshake, color: 'emerald' },
    ngo: { label: 'NGOs', icon: Building2, color: 'amber' },
    volunteer: { label: 'Volunteers', icon: Bike, color: 'blue' },
    admin: { label: 'Admins', icon: Shield, color: 'violet' },
};

const VERIFICATION_OPTIONS = ['pending', 'under_review', 'approved', 'rejected'];
const PAGE_SIZE = 10;

/* ─── Skeleton loader rows ─────────────────────────────────────────── */
const SkeletonRow = () => (
    <tr className="animate-pulse">
        {[...Array(7)].map((_, i) => (
            <td key={i} className="px-4 py-4">
                <div className={`h-4 bg-slate-800 rounded ${i === 0 ? 'w-40' : i === 6 ? 'w-28' : 'w-20'}`} />
            </td>
        ))}
    </tr>
);

/* ─── Toast component ──────────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
    <div className={`fixed top-6 right-6 z-[1100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-xl ${
        type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
            : 'bg-red-950/90 border-red-500/30 text-red-300'
    }`}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
);

/* ─── Badge components ─────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
    const colors = {
        donor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        ngo: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        volunteer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        admin: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${colors[role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
            {role}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const active = status === 'active';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
            active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {status}
        </span>
    );
};

const VerBadge = ({ status }) => {
    const styles = {
        approved: 'bg-emerald-500/10 text-emerald-400',
        rejected: 'bg-red-500/10 text-red-400',
        pending: 'bg-amber-500/10 text-amber-400',
        under_review: 'bg-blue-500/10 text-blue-400',
    };
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
            {status?.replace('_', ' ') || 'pending'}
        </span>
    );
};

/* ─── Modal wrapper ────────────────────────────────────────────────── */
const Modal = ({ children, onClose, size = 'md' }) => {
    const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className={`w-full ${widths[size]} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

/* ─── Form input component ─────────────────────────────────────────── */
const FormInput = ({ label, required, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        />
    </div>
);

const FormSelect = ({ label, required, children, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <select
            {...props}
            className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        >
            {children}
        </select>
    </div>
);

/* ─── Pagination component ─────────────────────────────────────────── */
const Pagination = ({ page, pages, total, onPageChange }) => {
    if (pages <= 1) return null;

    const getRange = () => {
        const range = [];
        const delta = 2;
        const start = Math.max(2, page - delta);
        const end = Math.min(pages - 1, page + delta);

        range.push(1);
        if (start > 2) range.push('...');
        for (let i = start; i <= end; i++) range.push(i);
        if (end < pages - 1) range.push('...');
        if (pages > 1) range.push(pages);
        return range;
    };

    return (
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300 font-medium">{(page - 1) * PAGE_SIZE + 1}</span>
                –<span className="text-slate-300 font-medium">{Math.min(page * PAGE_SIZE, total)}</span>
                {' '}of <span className="text-slate-300 font-medium">{total}</span> users
            </p>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(1)} disabled={page === 1} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronsLeft size={16} /></button>
                <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
                {getRange().map((p, i) =>
                    p === '...' ? (
                        <span key={`dots-${i}`} className="px-2 text-xs text-slate-600">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all ${
                                p === page
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button onClick={() => onPageChange(page + 1)} disabled={page === pages} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
                <button onClick={() => onPageChange(pages)} disabled={page === pages} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronsRight size={16} /></button>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                    */
/* ═══════════════════════════════════════════════════════════════════ */
const UserManagement = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeRole, setActiveRole] = useState(searchParams.get('role') || 'all');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [verificationFilter, setVerificationFilter] = useState(searchParams.get('verification') || '');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modal states
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [detailModal, setDetailModal] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [addForm, setAddForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'admin', address: '', city: '', state: '', pincode: '', organizationName: '', organizationType: '', registrationNumber: '', dailyCapacity: '' });
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem('token');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
            setUser(parsed);
        } else { navigate('/login'); }
    }, [navigate]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: PAGE_SIZE };
            if (activeRole !== 'all') params.role = activeRole;
            if (debouncedSearch) params.search = debouncedSearch;
            if (statusFilter) params.status = statusFilter;
            if (verificationFilter) params.verification = verificationFilter;
            const data = await getUsers(token, params);
            setUsers(data.users || []);
            setTotalPages(data.pages || 1);
            setTotalUsers(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            showToast('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, activeRole, debouncedSearch, statusFilter, verificationFilter, page]);

    useEffect(() => {
        if (token) fetchUsers();
    }, [fetchUsers, token]);

    useEffect(() => {
        const params = {};
        if (activeRole !== 'all') params.role = activeRole;
        if (statusFilter) params.status = statusFilter;
        if (verificationFilter) params.verification = verificationFilter;
        setSearchParams(params, { replace: true });
    }, [activeRole, statusFilter, verificationFilter, setSearchParams]);

    // Sync activeRole from URL when navigating via sidebar links
    useEffect(() => {
        const roleFromUrl = searchParams.get('role') || 'all';
        if (roleFromUrl !== activeRole) {
            setActiveRole(roleFromUrl);
        }
    }, [searchParams]);

    // Reset page on filter change
    useEffect(() => { setPage(1); }, [activeRole, debouncedSearch, statusFilter, verificationFilter]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    /* ─── Handlers ──────────────────────────────────────────── */
    const handleToggleStatus = async (userId) => {
        setActionLoading(true);
        try {
            await toggleUserStatus(userId, token);
            showToast('User status updated');
            fetchUsers();
        } catch (err) {
            showToast('Failed to update status', 'error');
        } finally { setActionLoading(false); }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        setActionLoading(true);
        try {
            await deleteUser(deleteModal._id, token);
            showToast('User deleted successfully');
            setDeleteModal(null);
            fetchUsers();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete user', 'error');
        } finally { setActionLoading(false); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updateUser(editModal._id, editForm, token);
            showToast('User updated successfully');
            setEditModal(null);
            fetchUsers();
        } catch (err) {
            showToast('Failed to update user', 'error');
        } finally { setActionLoading(false); }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createUser(addForm, token);
            showToast('User created successfully');
            setAddModal(false);
            setAddForm({ email: '', password: '', fullName: '', phone: '', role: 'admin', address: '', city: '', state: '', pincode: '', organizationName: '', organizationType: '', registrationNumber: '', dailyCapacity: '' });
            fetchUsers();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create user', 'error');
        } finally { setActionLoading(false); }
    };

    const handleVerificationChange = async (userId, newStatus) => {
        setActionLoading(true);
        try {
            await updateVerificationStatus(userId, newStatus, token);
            showToast(`Verification updated to ${newStatus}`);
            fetchUsers();
        } catch (err) {
            showToast('Failed to update verification', 'error');
        } finally { setActionLoading(false); }
    };

    const openEditModal = (u) => {
        setEditForm({
            fullName: u.fullName || '', phone: u.phone || '', role: u.role || '',
            address: u.address || '', city: u.city || '', state: u.state || '', pincode: u.pincode || '',
            organizationName: u.organizationName || '', organizationType: u.organizationType || '',
            registrationNumber: u.registrationNumber || '', dailyCapacity: u.dailyCapacity || '',
        });
        setEditModal(u);
    };

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    /* ─── RENDER ─────────────────────────────────────────────── */
    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Toast */}
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 mb-3 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                        <p className="text-sm text-slate-400 mt-1">Manage all platform users — create, edit, and control access.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right mr-2">
                            <span className="block text-2xl font-bold text-white">{totalUsers}</span>
                            <span className="text-xs text-slate-500">total users</span>
                        </div>
                        <button
                            onClick={() => setAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all"
                        >
                            <UserPlus size={16} /> Add User
                        </button>
                    </div>
                </div>

                {/* Role Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(ROLE_CONFIG).map(([key, val]) => {
                        const Icon = val.icon;
                        const active = activeRole === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveRole(key)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    active
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                                }`}
                            >
                                <Icon size={15} /> {val.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[260px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or organization..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                    </select>
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="px-3 py-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    >
                        <option value="">All Verification</option>
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    {(search || statusFilter || verificationFilter || activeRole !== 'all') && (
                        <button
                            onClick={() => { setSearch(''); setStatusFilter(''); setVerificationFilter(''); setActiveRole('all'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                        >
                            <X size={14} /> Clear All
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800/60">
                                    {['User', 'Role', 'Status', 'Verification', 'Location', 'Joined', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {loading ? (
                                    [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                                                    <Users size={24} className="text-slate-600" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-300">No users found</h3>
                                                <p className="text-xs text-slate-500">Try adjusting your filters or search term.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u._id} className="group hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                                        {u.fullName?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{u.fullName}</p>
                                                        <p className="text-xs text-slate-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5"><RoleBadge role={u.role} /></td>
                                            <td className="px-4 py-3.5"><StatusBadge status={u.status} /></td>
                                            <td className="px-4 py-3.5">
                                                <select
                                                    value={u.verificationStatus || 'pending'}
                                                    onChange={(e) => handleVerificationChange(u._id, e.target.value)}
                                                    disabled={actionLoading}
                                                    className="px-2 py-1 bg-slate-800/80 border border-slate-700 rounded-md text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                                                >
                                                    {VERIFICATION_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="text-xs text-slate-400">{u.city}{u.state ? `, ${u.state}` : ''}{!u.city && !u.state ? '—' : ''}</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="text-xs text-slate-500">{formatDate(u.createdAt)}</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setDetailModal(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="View"><Eye size={15} /></button>
                                                    <button onClick={() => openEditModal(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Edit"><Pencil size={15} /></button>
                                                    <button
                                                        onClick={() => handleVerificationChange(u._id, u.verificationStatus === 'approved' ? 'pending' : 'approved')}
                                                        disabled={actionLoading}
                                                        className={`p-1.5 rounded-lg transition-all ${u.verificationStatus === 'approved' ? 'text-emerald-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-amber-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                                        title={u.verificationStatus === 'approved' ? 'Unverify' : 'Verify'}
                                                    >
                                                        <CheckCircle2 size={15} className={u.verificationStatus === 'approved' ? '' : 'opacity-50'} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(u._id)}
                                                        disabled={actionLoading}
                                                        className={`p-1.5 rounded-lg transition-all ${u.status === 'active' ? 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                                        title={u.status === 'active' ? 'Disable' : 'Enable'}
                                                    >
                                                        {u.status === 'active' ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                                                    </button>
                                                    <button onClick={() => setDeleteModal(u)} disabled={actionLoading} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete"><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} pages={totalPages} total={totalUsers} onPageChange={setPage} />
                </div>

                {/* ═══ ADD USER MODAL ═══════════════════════════════════ */}
                {addModal && (
                    <Modal onClose={() => setAddModal(false)} size="md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <UserPlus size={18} className="text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">Add New User</h2>
                            </div>
                            <button onClick={() => setAddModal(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Full Name" required type="text" value={addForm.fullName} onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })} placeholder="John Doe" />
                                <FormInput label="Email" required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="john@example.com" />
                                <FormInput label="Password" required type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="Min 6 characters" />
                                <FormInput label="Phone" type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} placeholder="+91 98765 43210" />
                                <FormSelect label="Role" required value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
                                    <option value="admin">Admin</option>
                                </FormSelect>
                                <FormInput label="Address" type="text" value={addForm.address} onChange={(e) => setAddForm({ ...addForm, address: e.target.value })} placeholder="123 Main St" />
                                <FormInput label="City" type="text" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} placeholder="Mumbai" />
                                <FormInput label="State" type="text" value={addForm.state} onChange={(e) => setAddForm({ ...addForm, state: e.target.value })} placeholder="Maharashtra" />
                                <FormInput label="Pincode" type="text" value={addForm.pincode} onChange={(e) => setAddForm({ ...addForm, pincode: e.target.value })} placeholder="400001" />
                            </div>
                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                                <button type="button" onClick={() => setAddModal(false)} className="px-4 py-2.5 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all">
                                    {actionLoading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : <><Plus size={14} /> Create User</>}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* ═══ VIEW DETAIL MODAL ════════════════════════════════ */}
                {detailModal && (
                    <Modal onClose={() => setDetailModal(null)} size="md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="text-lg font-semibold text-white">User Details</h2>
                            <button onClick={() => setDetailModal(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"><X size={18} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="flex flex-col items-center gap-3 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-white">
                                    {detailModal.fullName?.[0]?.toUpperCase() || '?'}
                                </div>
                                <h3 className="text-lg font-bold text-white">{detailModal.fullName}</h3>
                                <div className="flex items-center gap-2">
                                    <RoleBadge role={detailModal.role} />
                                    <StatusBadge status={detailModal.status} />
                                    <VerBadge status={detailModal.verificationStatus} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    ['Email', detailModal.email],
                                    ['Phone', detailModal.phone],
                                    ['Address', detailModal.address],
                                    ['City', detailModal.city],
                                    ['State', detailModal.state],
                                    ['Pincode', detailModal.pincode],
                                    detailModal.organizationName && ['Organization', detailModal.organizationName],
                                    detailModal.organizationType && ['Org Type', detailModal.organizationType],
                                    detailModal.registrationNumber && ['Reg. Number', detailModal.registrationNumber],
                                    detailModal.dailyCapacity && ['Daily Capacity', detailModal.dailyCapacity],
                                    ['Joined', formatDate(detailModal.createdAt)],
                                    ['Last Updated', formatDate(detailModal.updatedAt)],
                                ].filter(Boolean).map(([label, val], i) => (
                                    <div key={i}>
                                        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                                        <p className="text-sm text-slate-200">{val || '—'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                )}

                {/* ═══ EDIT MODAL ═══════════════════════════════════════ */}
                {editModal && (
                    <Modal onClose={() => setEditModal(null)} size="md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="text-lg font-semibold text-white">Edit — {editModal.fullName}</h2>
                            <button onClick={() => setEditModal(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Full Name" required type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
                                <FormInput label="Phone" type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                                <FormSelect label="Role" required value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                                    <option value="donor">Donor</option>
                                    <option value="ngo">NGO</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="admin">Admin</option>
                                </FormSelect>
                                <FormInput label="Address" type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                                <FormInput label="City" type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                                <FormInput label="State" type="text" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
                                <FormInput label="Pincode" type="text" value={editForm.pincode} onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })} />
                                {(editForm.role === 'donor' || editForm.role === 'ngo') && (
                                    <>
                                        <FormInput label="Organization Name" type="text" value={editForm.organizationName} onChange={(e) => setEditForm({ ...editForm, organizationName: e.target.value })} />
                                        <FormInput label="Organization Type" type="text" value={editForm.organizationType} onChange={(e) => setEditForm({ ...editForm, organizationType: e.target.value })} />
                                    </>
                                )}
                                {editForm.role === 'ngo' && (
                                    <>
                                        <FormInput label="Registration Number" type="text" value={editForm.registrationNumber} onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value })} />
                                        <FormInput label="Daily Capacity" type="number" value={editForm.dailyCapacity} onChange={(e) => setEditForm({ ...editForm, dailyCapacity: e.target.value })} />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                                <button type="button" onClick={() => setEditModal(null)} className="px-4 py-2.5 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all">
                                    {actionLoading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* ═══ DELETE CONFIRMATION MODAL ════════════════════════ */}
                {deleteModal && (
                    <Modal onClose={() => setDeleteModal(null)} size="sm">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <Trash2 size={24} className="text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Delete User?</h2>
                                <p className="text-sm text-slate-400 mt-2">
                                    Are you sure you want to delete <span className="text-white font-medium">{deleteModal.fullName}</span> ({deleteModal.email})? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center gap-3 pt-2">
                                <button onClick={() => setDeleteModal(null)} className="px-4 py-2.5 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all">Cancel</button>
                                <button
                                    onClick={handleDelete}
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all"
                                >
                                    {actionLoading ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : <><Trash2 size={14} /> Delete User</>}
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;
