import React, { useState, useEffect } from 'react';

const FoodManagement = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    const mockData = [
        { id: 1, donorName: 'Alice', foodItem: 'Apples', quantity: 10, status: 'Available' },
        { id: 2, donorName: 'Bob', foodItem: 'Bananas', quantity: 5, status: 'Claimed' },
        { id: 3, donorName: 'Charlie', foodItem: 'Carrots', quantity: 20, status: 'Expiring' },
        { id: 4, donorName: 'David', foodItem: 'Donuts', quantity: 15, status: 'Available' },
        { id: 5, donorName: 'Eve', foodItem: 'Eggs', quantity: 12, status: 'Claimed' }
    ];

    useEffect(() => {
        setDonations(mockData);
        setFilteredDonations(mockData);
    }, []);

    useEffect(() => {
        let filtered = donations;
        if (statusFilter) {
            filtered = filtered.filter(donation => donation.status === statusFilter);
        }
        setFilteredDonations(filtered);
    }, [statusFilter, donations]);

    const handleMarkUnsafe = (id) => {
        console.log(`Food donation ${id} marked as unsafe`);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Food Donations Management</h2>
            <div className="mb-4">
                <select className="border p-2" onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Expiring">Expiring</option>
                </select>
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Donor Name</th>
                        <th className="border border-gray-300 p-2">Food Item</th>
                        <th className="border border-gray-300 p-2">Quantity</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonations.map(donation => (
                        <tr key={donation.id} className="border border-gray-300">
                            <td className="border border-gray-300 p-2">{donation.donorName}</td>
                            <td className="border border-gray-300 p-2">{donation.foodItem}</td>
                            <td className="border border-gray-300 p-2">{donation.quantity}</td>
                            <td className="border border-gray-300 p-2">{donation.status}</td>
                            <td className="border border-gray-300 p-2">
                                <button className="bg-red-500 text-white p-1" onClick={() => handleMarkUnsafe(donation.id)}>Mark Unsafe</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FoodManagement;