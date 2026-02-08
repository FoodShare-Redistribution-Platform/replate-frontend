// src/components/AdminUserTable.jsx
import React, { useState, useEffect } from 'react';
import { getUsers } from '../api/admin';

const AdminUserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Replace mockData with real API call later
    const mockData = [
        { id: 1, name: 'Alice', role: 'donor', status: 'active' },
        { id: 2, name: 'Bob', role: 'ngo', status: 'inactive' },
        { id: 3, name: 'Charlie', role: 'volunteer', status: 'active' },
        { id: 4, name: 'David', role: 'admin', status: 'active' },
        { id: 5, name: 'Eve', role: 'donor', status: 'inactive' }
    ];

    // Load users (currently mock data)
    useEffect(() => {
        setUsers(mockData);
        setFilteredUsers(mockData);

        // Uncomment this when backend is ready
        /*
        const token = localStorage.getItem('token'); // JWT token
        const fetchUsers = async () => {
            try {
                const data = await getUsers(token);
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
        */
    }, []);

    // Filter users by role and search term
    useEffect(() => {
        let filtered = users;
        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(filtered);
    }, [roleFilter, searchTerm, users]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Management</h2>

            <div className="mb-4 flex gap-2">
                <select
                    className="border p-2"
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="donor">Donor</option>
                    <option value="ngo">NGO</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by name"
                    className="border p-2 flex-1"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="border border-gray-300">
                            <td className="border border-gray-300 p-2">{user.name}</td>
                            <td className="border border-gray-300 p-2">{user.role}</td>
                            <td className="border border-gray-300 p-2">{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserTable;
