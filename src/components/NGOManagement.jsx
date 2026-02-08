import React, { useState, useEffect } from 'react';

const NGOManagement = () => {
    const [ngos, setNgos] = useState([]);
    const [filteredNgos, setFilteredNgos] = useState([]);
    const [verificationFilter, setVerificationFilter] = useState('');

    const mockData = [
        { id: 1, name: 'NGO A', verificationStatus: 'Verified', trustScore: 92, location: 'City A', donationHistory: 50 },
        { id: 2, name: 'NGO B', verificationStatus: 'Pending', trustScore: 85, location: 'City B', donationHistory: 30 },
        { id: 3, name: 'NGO C', verificationStatus: 'Verified', trustScore: 90, location: 'City C', donationHistory: 70 },
        { id: 4, name: 'NGO D', verificationStatus: 'Rejected', trustScore: 75, location: 'City D', donationHistory: 10 },
        { id: 5, name: 'NGO E', verificationStatus: 'Pending', trustScore: 80, location: 'City E', donationHistory: 20 }
    ];

    useEffect(() => {
        setNgos(mockData);
        setFilteredNgos(mockData);
    }, []);

    useEffect(() => {
        let filtered = ngos;
        if (verificationFilter) {
            filtered = filtered.filter(ngo => ngo.verificationStatus === verificationFilter);
        }
        setFilteredNgos(filtered);
    }, [verificationFilter, ngos]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">NGO Management</h2>
            <div className="mb-4">
                <select className="border p-2" onChange={(e) => setVerificationFilter(e.target.value)}>
                    <option value="">All Verification Status</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Verification Status</th>
                        <th className="border border-gray-300 p-2">Trust Score</th>
                        <th className="border border-gray-300 p-2">Location</th>
                        <th className="border border-gray-300 p-2">Donation History</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredNgos.map(ngo => (
                        <tr key={ngo.id} className="border border-gray-300">
                            <td className="border border-gray-300 p-2">{ngo.name}</td>
                            <td className="border border-gray-300 p-2">{ngo.verificationStatus}</td>
                            <td className="border border-gray-300 p-2">{ngo.trustScore}</td>
                            <td className="border border-gray-300 p-2">{ngo.location}</td>
                            <td className="border border-gray-300 p-2">{ngo.donationHistory}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NGOManagement;