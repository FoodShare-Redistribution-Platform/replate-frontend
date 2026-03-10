import fs from 'fs';

const filePath = 'c:/Users/shrut/OneDrive/Documents/Amrita Notes/sem 6/SE_project/replate-frontend/src/pages/admin/AdminPages.css';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = '.activity-time {';
const index = content.indexOf(targetStr);

if (index !== -1) {
    const cleanContent = content.substring(0, index) + `.activity-time {
    font-size: 0.75rem;
    color: #6b7280;
}

/* Admin Data Table Styling */
.admin-table-container {
    width: 100%;
    overflow-x: auto;
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
}

.admin-data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    color: #e5e7eb;
}

.admin-data-table th {
    background-color: #111827;
    padding: 16px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #9ca3af;
    border-bottom: 1px solid #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.admin-data-table td {
    padding: 16px;
    border-bottom: 1px solid #374151;
    font-size: 0.875rem;
    vertical-align: top;
}

.admin-data-table tr:last-child td {
    border-bottom: none;
}

.admin-data-table tr:hover {
    background-color: #374151;
}

.admin-data-table .item-name {
    font-weight: 600;
    color: #f9fafb;
    margin-bottom: 4px;
}

.admin-data-table .item-subtext {
    font-size: 0.75rem;
    color: #9ca3af;
}

.admin-data-table .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.status-pending { background-color: #feecdc; color: #b43403; }
.status-available { background-color: #e1effe; color: #1e429f; }
.status-accepted { background-color: #e1effe; color: #1e429f; }
.status-assigned { background-color: #e1effe; color: #1e429f; }
.status-in_transit { background-color: #fdf6b2; color: #723b13; }
.status-picked_up { background-color: #fdf6b2; color: #723b13; }
.status-delivered { background-color: #def7ec; color: #03543f; }
.status-cancelled { background-color: #fde8e8; color: #9b1c1c; }
.status-expired { background-color: #fde8e8; color: #9b1c1c; }
`;
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log("Fixed successfully!");
} else {
    console.log("Could not find the target string.");
}
