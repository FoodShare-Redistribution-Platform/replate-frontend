import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, user }) => {
    return (
        <div className="dashboard-container">
            <Sidebar user={user} />
            <div className="dashboard-main">
                <Topbar user={user} />
                <div className="dashboard-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
