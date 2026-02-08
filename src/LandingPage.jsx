import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="navbar-logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="logo-text">
                            food<span className="highlight">share</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-buttons">
                        <Link to="/login" className="btn btn-secondary">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="mobile-menu-button"
                    >
                        {isMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/login" className="btn btn-secondary">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="pulse-dot"></span>
                            Bridging the gap between surplus and scarcity
                        </div>
                        <h1 className="hero-title">
                            Share Food, <br />
                            <span className="gradient-text">Save Lives.</span>
                        </h1>
                        <p className="hero-description">
                            Connect surplus food from restaurants and events with communities in need.
                            Join our trusted network to reduce waste and fight hunger safely.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary btn-large btn-primary-large">
                                Start Donating
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-large">
                                I'm a Partner NGO
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">How Food Share Works</h2>
                        <p className="section-description">
                            Our platform ensures a seamless, safe, and efficient redistribution process
                            connecting donors with those who need it most.
                        </p>
                    </div>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">Report Surplus</h3>
                                <p className="step-description">
                                    Donors list available food with safety details, quantity, and pickup windows using our easy reporting tool.
                                </p>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">Safety Verification</h3>
                                <p className="step-description">
                                    Our system validates hygiene declarations and safety windows to ensure only safe, edible food is approved.
                                </p>
                            </div>
                        </div>

                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">Fast Redistribution</h3>
                                <p className="step-description">
                                    Nearby NGOs and volunteers are instantly notified to collect and distribute food before it perishes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats / Problem Statement */}
            <section className="impact-section">
                <div className="impact-bg"></div>
                <div className="section-container">
                    <div className="impact-grid">
                        <div className="impact-content">
                            <h2>The Paradox of Plenty</h2>
                            <p className="impact-text">
                                Despite the availability of large quantities of safe food, significant amounts
                                are wasted daily by restaurants and large events.
                            </p>
                            <p className="impact-text">
                                We believe this gap isn't about lack of food—it's about logistics.
                                Food Share provides the technology to bridge this gap safely and efficiently.
                            </p>
                            <div className="stats-grid">
                                <div>
                                    <div className="stat-number">40%</div>
                                    <div className="stat-label">Food Wasted Globally</div>
                                </div>
                                <div>
                                    <div className="stat-number">1 in 9</div>
                                    <div className="stat-label">People Go Hungry</div>
                                </div>
                            </div>
                        </div>
                        <div className="stakeholders-card">
                            <h3>Who We Support</h3>
                            <ul className="stakeholders-list">
                                <li className="stakeholder-item">
                                    <div className="stakeholder-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    Restaurants & Corporate Canteens
                                </li>
                                <li className="stakeholder-item">
                                    <div className="stakeholder-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    NGOs & Community Shelters
                                </li>
                                <li className="stakeholder-item">
                                    <div className="stakeholder-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    Volunteer Delivery Networks
                                </li>
                                <li className="stakeholder-item">
                                    <div className="stakeholder-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    Event Organizers & Banquet Halls
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            <div className="logo-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="logo-text">foodshare</span>
                        </div>
                        <p className="footer-description">
                            Empowering communities to share surplus food safely and dignifiedly.
                            Join the movement towards zero hunger.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/register">Donors</Link></li>
                            <li><Link to="/register">NGOs</Link></li>
                            <li><Link to="/login">Volunteers</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#">Safety Guidelines</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li>support@foodshare.org</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} Food Share Platform. All rights reserved.
                    </p>
                    <div className="social-links">
                        <div className="social-icon"></div>
                        <div className="social-icon"></div>
                        <div className="social-icon"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
