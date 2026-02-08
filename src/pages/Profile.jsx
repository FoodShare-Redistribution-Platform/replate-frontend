import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormData(data);
                setOriginalData(data);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setEditing(false);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    organizationName: formData.organizationName,
                    organizationType: formData.organizationType,
                    dailyCapacity: formData.dailyCapacity,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormData(data);
                setOriginalData(data);
                setEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating profile');
        }
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="profile-page">
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Profile</h1>
                        <p className="page-subtitle">Manage your personal and organization details</p>
                    </div>
                    <div className="header-actions">
                        {!editing ? (
                            <button onClick={handleEdit} className="btn btn-primary">
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button onClick={handleCancel} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn btn-primary">
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="profile-sections">
                    {/* Personal Information */}
                    <div className="profile-card">
                        <h2 className="card-title">Personal Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName || ''}
                                    disabled
                                    className="input-readonly"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    disabled
                                    className="input-readonly"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={editing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ''}
                                    disabled
                                    className="input-readonly"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Organization Information (Conditional) */}
                    {(user?.role === 'donor' || user?.role === 'ngo') && (
                        <div className="profile-card">
                            <h2 className="card-title">Organization Information</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Organization Name</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={editing ? '' : 'input-readonly'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Organization Type</label>
                                    <input
                                        type="text"
                                        name="organizationType"
                                        value={formData.organizationType || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={editing ? '' : 'input-readonly'}
                                    />
                                </div>
                                {user?.role === 'ngo' && (
                                    <>
                                        <div className="form-group">
                                            <label>Registration Number</label>
                                            <input
                                                type="text"
                                                value={formData.registrationNumber || ''}
                                                disabled
                                                className="input-readonly"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Daily Intake Capacity</label>
                                            <input
                                                type="number"
                                                name="dailyCapacity"
                                                value={formData.dailyCapacity || ''}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={editing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Location Information */}
                    <div className="profile-card">
                        <h2 className="card-title">Location Information</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={editing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={editing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={editing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className={editing ? '' : 'input-readonly'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Map Integration - To be implemented
                    <div className="profile-card">
                        <h2 className="card-title">Live Map</h2>
                        <div className="placeholder-map">
                            <p>Map integration coming soon...</p>
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
