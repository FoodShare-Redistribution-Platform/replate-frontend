import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Check verification status
                if (data.role !== 'admin' && data.verificationStatus !== 'approved') {
                    const statusText = (data.verificationStatus || 'pending').replace('_', ' ');
                    alert(`Your account is ${statusText}. Please wait for admin approval before accessing the system.`);
                    setLoading(false);
                    return;
                }

                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: data._id,
                    email: data.email,
                    fullName: data.fullName,
                    role: data.role,
                    verificationStatus: data.verificationStatus,
                    status: data.status
                }));

                // Redirect admin to admin dashboard, others to user dashboard
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Branding */}
            <div className="login-left">
                <div className="brand-content">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="brand-name">FoodShare</h1>
                    </div>
                    <div className="welcome-text">
                        <h2>Welcome Back!</h2>
                        <p>Continue your mission to reduce food waste and fight hunger. Your impact matters.</p>
                    </div>
                    <div className="stats-section">
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Meals Saved</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">200+</div>
                            <div className="stat-label">Partners</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Lives Impacted</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-right">
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2 className="form-title">Sign In</h2>
                        <p className="form-subtitle">Enter your credentials to access your account</p>

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

                        <div className="form-actions">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary btn-full">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="form-footer">
                            Don't have an account? <Link to="/register" className="link">Create account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;


