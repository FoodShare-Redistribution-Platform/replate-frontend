import React, { useEffect, useState } from 'react';

const PickupDetailsStep = ({ formData, updateFormData }) => {
    const [remainingTime, setRemainingTime] = useState('');

    // Calculate remaining safe time for summary
    useEffect(() => {
        if (formData.expiryDate && formData.expiryTime) {
            const expiryDateTime = new Date(`${formData.expiryDate}T${formData.expiryTime}`);
            const now = new Date();
            const diff = expiryDateTime - now;

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setRemainingTime(`${hours}h ${minutes}m`);
            } else {
                setRemainingTime('Expired');
            }
        }
    }, [formData.expiryDate, formData.expiryTime]);

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-icon-box">
                    <span className="step-emoji">📍</span>
                </div>
                <div>
                    <h2 className="step-title">Pickup Details</h2>
                    <p className="step-description">Where and when can we collect the food?</p>
                </div>
            </div>

            <div className="pickup-layout">
                <div className="pickup-form">
                    <div className="form-group">
                        <label htmlFor="pickupAddress">Pickup Address <span className="required">*</span></label>
                        <textarea
                            id="pickupAddress"
                            value={formData.pickupAddress || ''}
                            onChange={(e) => updateFormData({ pickupAddress: e.target.value })}
                            className="form-textarea"
                            rows="3"
                            placeholder="Enter complete pickup address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City <span className="required">*</span></label>
                        <input
                            type="text"
                            id="city"
                            value={formData.city || ''}
                            onChange={(e) => updateFormData({ city: e.target.value })}
                            className="form-input"
                            placeholder="Enter city"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pickupDeadline">Pickup Deadline <span className="required">*</span></label>
                        <input
                            type="datetime-local"
                            id="pickupDeadline"
                            value={formData.pickupDeadline || ''}
                            onChange={(e) => updateFormData({ pickupDeadline: e.target.value })}
                            className={`form-input ${formData.pickupDeadline && formData.expiryDate && formData.expiryTime && new Date(formData.pickupDeadline) >= new Date(`${formData.expiryDate}T${formData.expiryTime}`) ? 'input-error' : ''}`}
                            required
                        />
                        <p className="field-hint">Latest time food can be picked up</p>
                        {formData.pickupDeadline && formData.expiryDate && formData.expiryTime && new Date(formData.pickupDeadline) >= new Date(`${formData.expiryDate}T${formData.expiryTime}`) && (
                            <p className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                ⚠️ Pickup deadline must be before food expiry time!
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pickupInstructions">Pickup Instructions (Optional)</label>
                        <textarea
                            id="pickupInstructions"
                            value={formData.pickupInstructions || ''}
                            onChange={(e) => updateFormData({ pickupInstructions: e.target.value })}
                            className="form-textarea"
                            rows="3"
                            placeholder="Any special instructions for pickup (e.g., gate code, parking info)"
                        />
                    </div>
                </div>

                <div className="summary-card">
                    <h3 className="summary-title">Donation Summary</h3>

                    <div className="summary-section">
                        <div className="summary-item">
                            <span className="summary-label">Food Item</span>
                            <span className="summary-value">{formData.foodName || 'Not specified'}</span>
                        </div>

                        <div className="summary-item">
                            <span className="summary-label">Type</span>
                            <span className="summary-value">{formData.foodType || 'Not specified'}</span>
                        </div>

                        <div className="summary-item">
                            <span className="summary-label">Quantity</span>
                            <span className="summary-value">
                                {formData.quantity || '0'} {formData.unit || 'servings'}
                            </span>
                        </div>

                        <div className="summary-item">
                            <span className="summary-label">Estimated Servings</span>
                            <span className="summary-value">{formData.estimatedServings || '0'} people</span>
                        </div>

                        {formData.dietaryTags && formData.dietaryTags.length > 0 && (
                            <div className="summary-item">
                                <span className="summary-label">Dietary Tags</span>
                                <div className="summary-tags">
                                    {formData.dietaryTags.map(tag => (
                                        <span key={tag} className="summary-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="summary-item">
                            <span className="summary-label">Storage</span>
                            <span className="summary-value">{formData.storageCondition || 'Not specified'}</span>
                        </div>

                        {remainingTime && (
                            <div className="summary-item highlight">
                                <span className="summary-label">Remaining Safe Time</span>
                                <span className={`summary-value ${remainingTime === 'Expired' ? 'danger' : 'success'}`}>
                                    {remainingTime}
                                </span>
                            </div>
                        )}

                        {formData.allergens && formData.allergens.length > 0 && (
                            <div className="summary-item warning">
                                <span className="summary-label">⚠️ Allergens</span>
                                <span className="summary-value">{formData.allergens.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    <div className="summary-footer">
                        <p className="summary-note">
                            Please review all details carefully before submitting your donation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickupDetailsStep;
