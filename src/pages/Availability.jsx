import React, { useState, useEffect } from 'react';
import './Availability.css';

const Availability = () => {
    // Manually get user from localStorage since AuthContext is missing
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [isAvailable, setIsAvailable] = useState(false);
    const [vehicleType, setVehicleType] = useState('two_wheeler');
    const [maxWeight, setMaxWeight] = useState(10);
    const [serviceRadius, setServiceRadius] = useState(5);
    const [schedule, setSchedule] = useState({
        mon: { active: true, slots: [{ start: '09:00', end: '12:00' }, { start: '17:00', end: '20:00' }] },
        tue: { active: true, slots: [{ start: '09:00', end: '12:00' }] },
        wed: { active: false, slots: [] },
        thu: { active: true, slots: [{ start: '14:00', end: '18:00' }] },
        fri: { active: true, slots: [{ start: '09:00', end: '21:00' }] },
        sat: { active: true, slots: [{ start: '08:00', end: '14:00' }] },
        sun: { active: false, slots: [] }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);

                // Populate state from DB data
                if (userData) {
                    setIsAvailable(userData.isAvailable);
                    setVehicleType(userData.vehicleType || userData.volunteerProfile?.vehicleType || 'two_wheeler');

                    if (userData.volunteerProfile) {
                        setServiceRadius(userData.volunteerProfile.serviceRadius || 5);
                        if (userData.volunteerProfile.maxWeight !== undefined) {
                            setMaxWeight(userData.volunteerProfile.maxWeight);
                        }
                        if (userData.volunteerProfile.availabilitySchedule) {
                            // Ensure schedule has all days even if backend is partial
                            setSchedule(prev => ({
                                ...prev,
                                ...userData.volunteerProfile.availabilitySchedule
                            }));
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/volunteer-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    isAvailable,
                    vehicleType,
                    maxWeight,
                    serviceRadius,
                    availabilitySchedule: schedule
                })
            });

            if (response.ok) {
                alert('Availability settings saved to database!');
                fetchProfile(); // Refresh data
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to reset your availability settings? This will clear all slots and preferences.")) return;

        // Reset local state to defaults
        const defaultSchedule = {
            mon: { active: false, slots: [] },
            tue: { active: false, slots: [] },
            wed: { active: false, slots: [] },
            thu: { active: false, slots: [] },
            fri: { active: false, slots: [] },
            sat: { active: false, slots: [] },
            sun: { active: false, slots: [] }
        };

        setSchedule(defaultSchedule);
        setServiceRadius(5);
        setIsAvailable(false);

        // Save these empty/default values to DB
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/volunteer-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    isAvailable: false,
                    serviceRadius: 5,
                    availabilitySchedule: defaultSchedule
                })
            });

            if (response.ok) {
                alert('Availability settings reset!');
                fetchProfile();
            }
        } catch (error) {
            console.error('Error resetting profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day].active }
        }));
    };

    return (
        <>
            <div className="availability-container">
                <div className="availability-header">
                    <div>
                        <h1>Availability Settings</h1>
                        <p>Manage your schedule and preferences for food pickups</p>
                    </div>
                    <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                        <button className="reset-btn" onClick={handleDelete} disabled={loading} style={{ background: '#ef4444', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            Reset
                        </button>
                        <button className="save-btn" onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Top Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <h3>{Object.values(schedule).filter(d => d.active).length}</h3>
                            <span>Active Days</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🕒</div>
                        <div className="stat-info">
                            <h3>31.0</h3>
                            <span>Weekly Hours</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📍</div>
                        <div className="stat-info">
                            <h3>{serviceRadius} km</h3>
                            <span>Service Radius</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚖️</div>
                        <div className="stat-info">
                            <h3>{maxWeight} kg</h3>
                            <span>Max Capacity</span>
                        </div>
                    </div>
                </div>

                <div className="main-grid">
                    {/* Left Column: Settings */}
                    <div className="settings-section">

                        {/* Availability Toggle */}
                        <div className="settings-card availability-toggle-card">
                            <div className="status-header">
                                <h3>Availability Status</h3>
                            </div>
                            <div className="status-indicator">
                                <div className={`status-dot ${isAvailable ? 'active' : ''}`}></div>
                                <span>{isAvailable ? 'Available for Pickups' : 'Offline'}</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={isAvailable}
                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        {/* Vehicle Info */}
                        <div className="settings-card">
                            <div className="card-header">
                                <h3>Vehicle Information</h3>
                                <p className="subtitle">Vehicle Type</p>
                            </div>
                            <div className="vehicle-grid">
                                <div
                                    className={`vehicle-option ${vehicleType === 'bicycle' ? 'selected' : ''}`}
                                    onClick={() => { setVehicleType('bicycle'); setMaxWeight(5); }}
                                >
                                    <div className="vehicle-icon">🚲</div>
                                    <div className="vehicle-name">Bicycle</div>
                                    <div className="vehicle-capacity">Up to 5 kg</div>
                                </div>
                                <div
                                    className={`vehicle-option ${vehicleType === 'two_wheeler' ? 'selected' : ''}`}
                                    onClick={() => { setVehicleType('two_wheeler'); setMaxWeight(10); }}
                                >
                                    <div className="vehicle-icon">🛵</div>
                                    <div className="vehicle-name">Two Wheeler</div>
                                    <div className="vehicle-capacity">Up to 10 kg</div>
                                </div>
                                <div
                                    className={`vehicle-option ${vehicleType === 'car' ? 'selected' : ''}`}
                                    onClick={() => { setVehicleType('car'); setMaxWeight(50); }}
                                >
                                    <div className="vehicle-icon">🚗</div>
                                    <div className="vehicle-name">Car</div>
                                    <div className="vehicle-capacity">Up to 50 kg</div>
                                </div>
                                <div
                                    className={`vehicle-option ${vehicleType === 'van' ? 'selected' : ''}`}
                                    onClick={() => { setVehicleType('van'); setMaxWeight(200); }}
                                >
                                    <div className="vehicle-icon">🚚</div>
                                    <div className="vehicle-name">Van</div>
                                    <div className="vehicle-capacity">Up to 200 kg</div>
                                </div>
                            </div>

                            <div className="input-group">
                                {/* Vehicle number placeholder as per screenshot */}
                                <input type="text" className="vehicle-number-input" placeholder="Vehicle Number" defaultValue="KA-01-AB-1234" />
                            </div>

                            <div className="radius-slider-container">
                                <div className="card-header">
                                    <p className="subtitle">Service Radius: {serviceRadius} km</p>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="25"
                                    value={serviceRadius}
                                    onChange={(e) => setServiceRadius(Number(e.target.value))}
                                />
                                <div className="radius-labels">
                                    <span>1 km</span>
                                    <span>25 km</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Schedule */}
                    <div className="schedule-section">
                        <div className="settings-card" style={{ height: '100%' }}>
                            <div className="card-header">
                                <h3>Weekly Schedule</h3>
                            </div>

                            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                                <div key={day} className="day-row" style={{ marginBottom: '16px' }}>
                                    <div className="day-header">
                                        <div className="day-label">
                                            <label className="toggle-switch" style={{ width: '40px', height: '20px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={schedule[day].active}
                                                    onChange={() => toggleDay(day)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span style={{ textTransform: 'capitalize' }}>{day}</span>
                                        </div>
                                        <button
                                            className="add-slot-btn"
                                            onClick={() => {
                                                setSchedule(prev => ({
                                                    ...prev,
                                                    [day]: {
                                                        ...prev[day],
                                                        // Add a default slot, user can edit logic later if needed
                                                        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
                                                    }
                                                }));
                                            }}
                                        >
                                            + Add Slot
                                        </button>
                                    </div>

                                    {schedule[day].active && schedule[day].slots.map((slot, idx) => (
                                        <div key={idx} className="time-slot">
                                            <span>{slot.start} - {slot.end}</span>
                                            <button
                                                className="delete-slot-btn"
                                                onClick={() => {
                                                    setSchedule(prev => ({
                                                        ...prev,
                                                        [day]: {
                                                            ...prev[day],
                                                            slots: prev[day].slots.filter((_, i) => i !== idx)
                                                        }
                                                    }));
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Availability;
