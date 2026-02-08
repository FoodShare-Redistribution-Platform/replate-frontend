import React, { useState, useEffect } from 'react';

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const mockData = [
        { id: 1, name: 'Alice', availability: 'Available', trustScore: 90, deliveryCount: 5, vehicle: 'Car', location: 'City A' },
        { id: 2, name: 'Bob', availability: 'Unavailable', trustScore: 85, deliveryCount: 3, vehicle: 'Bike', location: 'City B' },
        { id: 3, name: 'Charlie', availability: 'Available', trustScore: 95, deliveryCount: 10, vehicle: 'Van', location: 'City C' },
        { id: 4, name: 'David', availability: 'Unavailable', trustScore: 80, deliveryCount: 2, vehicle: 'Car', location: 'City D' },
        { id: 5, name: 'Eve', availability: 'Available', trustScore: 88, deliveryCount: 7, vehicle: 'Truck', location: 'City E' }
    ];

    useEffect(() => {
        setVolunteers(mockData);
        setFilteredVolunteers(mockData);
    }, []);

    useEffect(() => {
        let filtered = volunteers;
        if (availabilityFilter) {
            filtered = filtered.filter(volunteer => volunteer.availability === availabilityFilter);
        }
        if (searchTerm) {
            filtered = filtered.filter(volunteer => volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredVolunteers(filtered);
    }, [availabilityFilter, searchTerm, volunteers]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Volunteer Management</h2>
            <div className="mb-4">
                <select className="border p-2" onChange={(e) => setAvailabilityFilter(e.target.value)}>
                    <option value="">All Availability</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by name"
                    className="border p-2 ml-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Availability</th>
                        <th className="border border-gray-300 p-2">Trust Score</th>
                        <th className="border border-gray-300 p-2">Delivery Count</th>
                        <th className="border border-gray-300 p-2">Vehicle</th>
                        <th className="border border-gray-300 p-2">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVolunteers.map(volunteer => (
                        <tr key={volunteer.id} className="border border-gray-300">
                            <td className="border border-gray-300 p-2">{volunteer.name}</td>
                            <td className="border border-gray-300 p-2">{volunteer.availability}</td>
                            <td className="border border-gray-300 p-2">{volunteer.trustScore}</td>
                            <td className="border border-gray-300 p-2">{volunteer.deliveryCount}</td>
                            <td className="border border-gray-300 p-2">{volunteer.vehicle}</td>
                            <td className="border border-gray-300 p-2">{volunteer.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteerManagement;