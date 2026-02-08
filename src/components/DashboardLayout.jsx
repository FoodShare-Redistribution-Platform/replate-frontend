<<<<<<< HEAD
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
=======
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, user }) => {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar user={user} />
            <div className="ml-[272px] flex-1 flex flex-col min-h-screen">
                <Topbar user={user} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
>>>>>>> d9f179565dedd4fc43489aaf77c6eea62967c2ca
