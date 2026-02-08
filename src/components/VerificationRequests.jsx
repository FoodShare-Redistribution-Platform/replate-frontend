import React, { useState, useEffect } from 'react';

const VerificationRequests = () => {
    const [requests, setRequests] = useState([]);

    const mockData = [
        { id: 1, name: 'Alice', role: 'donor', document: 'ID Proof', status: 'pending' },
        { id: 2, name: 'Bob', role: 'ngo', document: 'Registration Certificate', status: 'approved' },
        { id: 3, name: 'Charlie', role: 'volunteer', document: 'Background Check', status: 'pending' },
        { id: 4, name: 'David', role: 'admin', document: 'Admin ID', status: 'rejected' },
        { id: 5, name: 'Eve', role: 'donor', document: 'Address Proof', status: 'pending' }
    ];

    useEffect(() => {
        setRequests(mockData);
    }, []);

    const handleApprove = (id) => {
        console.log(`Request ${id} approved`);
    };

    const handleReject = (id) => {
        console.log(`Request ${id} rejected`);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Verification Requests</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Document</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id} className="border border-gray-300">
                            <td className="border border-gray-300 p-2">{request.name}</td>
                            <td className="border border-gray-300 p-2">{request.role}</td>
                            <td className="border border-gray-300 p-2">{request.document}</td>
                            <td className="border border-gray-300 p-2">{request.status}</td>
                            <td className="border border-gray-300 p-2">
                                <button className="bg-green-500 text-white p-1 mr-2" onClick={() => handleApprove(request.id)}>Approve</button>
                                <button className="bg-red-500 text-white p-1" onClick={() => handleReject(request.id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerificationRequests;