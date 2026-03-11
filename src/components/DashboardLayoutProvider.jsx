import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ExpiredAlert from './ExpiredAlert';
import './DashboardLayout.css';

const DashboardLayoutProvider = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]);

    if (loading) return null;

    return (
        <div className="dashboard-container">
            <ExpiredAlert />
            <Sidebar user={user} />
            <div className="dashboard-main">
                <Topbar user={user} />
                <div className="dashboard-content">
                    <Outlet context={{ user }} />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayoutProvider;
