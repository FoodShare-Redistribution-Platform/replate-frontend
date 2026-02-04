import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        email: '',
        password: '',
        confirmPassword: '',
        // Step 2
        fullName: '',
        phone: '',
        role: 'donor',
        organizationName: '',
        organizationType: '',
        registrationNumber: '',
        dailyCapacity: '',
        // Step 3
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    role: formData.role,
                    organizationName: formData.organizationName,
                    organizationType: formData.organizationType,
                    registrationNumber: formData.registrationNumber,
                    dailyCapacity: formData.dailyCapacity,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    };

    return (
        <div className="register-container">
            {/* Left Side - Branding */}
            <div className="register-left">
                <div className="brand-content">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="brand-name">FoodShare</h1>
                    </div>

                    <div className="mission-text">
                        <h2>Join the Movement to End Food Waste</h2>
                        <p>Connect surplus food with communities in need. Together, we can make a difference.</p>
                    </div>

                    <div className="feature-list">
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Safe & verified food redistribution</span>
                        </div>
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Real-time matching with nearby partners</span>
                        </div>
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Track your impact & contributions</span>
                        </div>
                    </div>

                    <div className="stats-section">
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Meals Saved</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Active Partners</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="register-right">
                <div className="form-container">
                    {/* Step Indicator */}
                    <div className="step-indicator">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {currentStep > 1 ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : '1'}
                            </div>
                            <div className="step-label">Account</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {currentStep > 2 ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : '2'}
                            </div>
                            <div className="step-label">Details</div>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                            <div className="step-circle">3</div>
                            <div className="step-label">Location</div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Step 1: Create Account */}
                        {currentStep === 1 && (
                            <div className="form-step">
                                <h2 className="form-title">Create Account</h2>
                                <p className="form-subtitle">Start your journey with FoodShare</p>

                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button type="button" onClick={handleNext} className="btn btn-primary btn-full">
                                    Continue
                                </button>

                                <div className="form-footer">
                                    Already have an account? <Link to="/login" className="link">Sign in</Link>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Your Details */}
                        {currentStep === 2 && (
                            <div className="form-step">
                                <h2 className="form-title">Your Details</h2>
                                <p className="form-subtitle">Tell us about yourself</p>

                                <div className="form-group">
                                    <label htmlFor="fullName">Full name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">I am registering as</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select your role</option>
                                        <option value="donor">Donor (Restaurant / Hotel / Caterer)</option>
                                        <option value="ngo">NGO / Shelter / Community Kitchen</option>
                                        <option value="volunteer">Volunteer</option>
                                    </select>
                                </div>

                                {/* Conditional Fields for Donor */}
                                {formData.role === 'donor' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="organizationName">Organization name</label>
                                            <input
                                                type="text"
                                                id="organizationName"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                placeholder="Your restaurant/hotel name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="organizationType">Organization type</label>
                                            <select
                                                id="organizationType"
                                                name="organizationType"
                                                value={formData.organizationType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select type</option>
                                                <option value="restaurant">Restaurant</option>
                                                <option value="hotel">Hotel</option>
                                                <option value="caterer">Caterer</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Conditional Fields for NGO */}
                                {formData.role === 'ngo' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="organizationName">Organization name</label>
                                            <input
                                                type="text"
                                                id="organizationName"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                placeholder="Your NGO/shelter name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="organizationType">Organization type</label>
                                            <select
                                                id="organizationType"
                                                name="organizationType"
                                                value={formData.organizationType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select type</option>
                                                <option value="ngo">NGO</option>
                                                <option value="shelter">Shelter</option>
                                                <option value="community_kitchen">Community Kitchen</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="registrationNumber">NGO registration number</label>
                                            <input
                                                type="text"
                                                id="registrationNumber"
                                                name="registrationNumber"
                                                value={formData.registrationNumber}
                                                onChange={handleChange}
                                                placeholder="REG123456"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="dailyCapacity">Daily intake capacity (servings)</label>
                                            <input
                                                type="number"
                                                id="dailyCapacity"
                                                name="dailyCapacity"
                                                value={formData.dailyCapacity}
                                                onChange={handleChange}
                                                placeholder="100"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="button-group">
                                    <button type="button" onClick={handleBack} className="btn btn-secondary">
                                        Back
                                    </button>
                                    <button type="button" onClick={handleNext} className="btn btn-primary">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Location */}
                        {currentStep === 3 && (
                            <div className="form-step">
                                <h2 className="form-title">Location</h2>
                                <p className="form-subtitle">Where are you located?</p>

                                <div className="form-group">
                                    <label htmlFor="address">Full address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street address, building, floor"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="New York"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="NY"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="10001"
                                        required
                                    />
                                </div>

                                <div className="button-group">
                                    <button type="button" onClick={handleBack} className="btn btn-secondary">
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
