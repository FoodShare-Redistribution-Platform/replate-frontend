import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FoodDetailsStep from '../components/donate/FoodDetailsStep';
import SafetyInfoStep from '../components/donate/SafetyInfoStep';
import HygieneDeclarationStep from '../components/donate/HygieneDeclarationStep';
import PickupDetailsStep from '../components/donate/PickupDetailsStep';
import './DonateFood.css';

const DonateFood = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    // Check if we're in edit mode
    const editMode = location.state?.editMode || false;
    const existingDonation = location.state?.donationData || null;

    const [formData, setFormData] = useState({
        foodType: '',
        foodName: '',
        description: '',
        quantity: '',
        unit: 'servings',
        estimatedServings: '',
        dietaryTags: [],
        foodPhoto: null,
        preparationDate: '',
        preparationTime: '',
        expiryDate: '',
        expiryTime: '',
        storageCondition: '',
        allergens: [],
        hygiene: {
            safeHandling: false,
            temperatureControl: false,
            properPackaging: false,
            noContamination: false
        },
        pickupAddress: '',
        city: '',
        pickupDeadline: '',
        pickupInstructions: ''
    });

    useEffect(() => {
        fetchUser();

        // If in edit mode, pre-fill the form
        if (editMode && existingDonation) {
            setFormData({
                foodType: existingDonation.foodType || '',
                foodName: existingDonation.foodName || '',
                description: existingDonation.description || '',
                quantity: existingDonation.quantity || '',
                unit: existingDonation.unit || 'servings',
                estimatedServings: existingDonation.estimatedServings || '',
                dietaryTags: existingDonation.dietaryTags || [],
                foodPhoto: existingDonation.foodPhoto || null, // Assuming photo is handled separately or not editable directly
                preparationDate: existingDonation.preparationDate ? new Date(existingDonation.preparationDate).toISOString().split('T')[0] : '',
                preparationTime: existingDonation.preparationTime || '',
                expiryDate: existingDonation.expiryDate ? new Date(existingDonation.expiryDate).toISOString().split('T')[0] : '',
                expiryTime: existingDonation.expiryTime || '',
                storageCondition: existingDonation.storageCondition || '',
                allergens: existingDonation.allergens || [],
                hygiene: existingDonation.hygiene || {
                    safeHandling: false,
                    temperatureControl: false,
                    properPackaging: false,
                    noContamination: false
                },
                pickupAddress: existingDonation.pickupAddress || '',
                city: existingDonation.city || '',
                pickupDeadline: existingDonation.pickupDeadline ? new Date(existingDonation.pickupDeadline).toISOString().split('T')[0] : '',
                pickupInstructions: existingDonation.pickupInstructions || ''
            });
        }
    }, [editMode, existingDonation]);

    const fetchUser = async () => {
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
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Food Details', icon: '1' },
        { number: 2, title: 'Safety Info', icon: '2' },
        { number: 3, title: 'Hygiene Declaration', icon: '3' },
        { number: 4, title: 'Pickup Details', icon: '4' }
    ];

    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.foodType && formData.foodName && formData.quantity && formData.estimatedServings;
            case 2:
                return formData.preparationDate && formData.preparationTime &&
                    formData.expiryDate && formData.expiryTime && formData.storageCondition;
            case 3:
                return formData.hygiene.safeHandling && formData.hygiene.temperatureControl &&
                    formData.hygiene.properPackaging && formData.hygiene.noContamination;
            case 4:
                const isDeadlineValid = !formData.pickupDeadline || !formData.expiryDate || !formData.expiryTime ||
                    new Date(formData.pickupDeadline) < new Date(`${formData.expiryDate}T${formData.expiryTime}`);
                return formData.pickupAddress && formData.city && formData.pickupDeadline && isDeadlineValid;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canProceed() && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');

        // Get current location for map tracking
        const getLocation = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                        },
                        (error) => {
                            console.warn('Geolocation error:', error);
                            resolve(null); // Don't fail if location cannot be obtained
                        }
                    );
                } else {
                    resolve(null);
                }
            });
        };

        try {
            // Try to get current location
            const location = await getLocation();

            const url = editMode && existingDonation
                ? `http://localhost:5000/api/donations/${existingDonation._id}`
                : 'http://localhost:5000/api/donations';

            const method = editMode && existingDonation ? 'PUT' : 'POST';

            const donationData = {
                ...formData,
                ...(location && { location }) // Add location if available
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(donationData)
            });

            const data = await response.json();

            if (response.ok) {
                const message = editMode
                    ? 'Donation updated successfully!'
                    : 'Donation submitted successfully! Thank you for helping reduce food waste.';
                alert(message);
                console.log(editMode ? 'Donation updated:' : 'Donation created:', data.data);

                // Navigate back to My Donations
                navigate('/my-donations');
            } else {
                alert(`Failed to ${editMode ? 'update' : 'submit'} donation: ${data.message || 'Please try again'}`);
            }
        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'submitting'} donation:`, error);
            alert(`An error occurred while ${editMode ? 'updating' : 'submitting'} your donation. Please try again.`);
        }
    };

    const renderStep = () => {
        const stepProps = { formData, updateFormData };

        switch (currentStep) {
            case 1:
                return <FoodDetailsStep {...stepProps} />;
            case 2:
                return <SafetyInfoStep {...stepProps} />;
            case 3:
                return <HygieneDeclarationStep {...stepProps} />;
            case 4:
                return <PickupDetailsStep {...stepProps} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="donate-page">
                {/* Page Header */}
                <div className="donate-header">
                    <h1 className="donate-title">{editMode ? 'Edit Donation' : 'Donate Surplus Food'}</h1>
                    <p className="donate-subtitle">
                        {editMode
                            ? 'Update your donation details'
                            : 'Help reduce food waste by donating safe, edible surplus food'}
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="stepper-container">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className={`stepper-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                                <div className="stepper-circle">
                                    {currentStep > step.number ? (
                                        <span className="stepper-check">✓</span>
                                    ) : (
                                        <span className="stepper-number">{step.icon}</span>
                                    )}
                                </div>
                                <span className="stepper-label">{step.title}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`stepper-line ${currentStep > step.number ? 'completed' : ''}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Content */}
                <div className="form-container">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="form-navigation">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary"
                        disabled={currentStep === 1}
                    >
                        ← Back
                    </button>

                    {currentStep === 4 ? (
                        <button
                            className="btn-next"
                            onClick={handleSubmit}
                            disabled={!canProceed()}
                        >
                            {editMode ? 'Update Donation' : 'Submit Donation'} ✓
                        </button>
                    ) : (
                        <button
                            className="btn-next"
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            Continue →
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DonateFood;
