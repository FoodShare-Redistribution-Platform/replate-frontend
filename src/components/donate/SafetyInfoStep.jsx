import React, { useEffect, useState } from 'react';

const SafetyInfoStep = ({ formData, updateFormData }) => {
    const [remainingTime, setRemainingTime] = useState('');

    const storageConditions = [
        'Refrigerated (0-4°C)',
        'Room Temperature (20-25°C)',
        'Frozen (-18°C or below)',
        'Hot Hold (above 60°C)'
    ];

    const allergenOptions = [
        'Gluten',
        'Dairy',
        'Eggs',
        'Nuts',
        'Peanuts',
        'Soy',
        'Fish',
        'Shellfish',
        'Sesame'
    ];

    const handleChange = (field, value) => {
        updateFormData({ [field]: value });
    };

    const toggleAllergen = (allergen) => {
        const currentAllergens = formData.allergens || [];
        const newAllergens = currentAllergens.includes(allergen)
            ? currentAllergens.filter(a => a !== allergen)
            : [...currentAllergens, allergen];
        updateFormData({ allergens: newAllergens });
    };

    // Calculate remaining safe time
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
                    <span className="step-emoji">🛡️</span>
                </div>
                <div>
                    <h2 className="step-title">Safety Info</h2>
                    <p className="step-description">Ensure food safety for recipients</p>
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="preparationDate">Preparation Date <span className="required">*</span></label>
                    <input
                        type="date"
                        id="preparationDate"
                        value={formData.preparationDate || ''}
                        onChange={(e) => handleChange('preparationDate', e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="preparationTime">Preparation Time <span className="required">*</span></label>
                    <input
                        type="time"
                        id="preparationTime"
                        value={formData.preparationTime || ''}
                        onChange={(e) => handleChange('preparationTime', e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="expiryDate">Safe Until Date <span className="required">*</span></label>
                    <input
                        type="date"
                        id="expiryDate"
                        value={formData.expiryDate || ''}
                        onChange={(e) => handleChange('expiryDate', e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="expiryTime">Safe Until Time <span className="required">*</span></label>
                    <input
                        type="time"
                        id="expiryTime"
                        value={formData.expiryTime || ''}
                        onChange={(e) => handleChange('expiryTime', e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                {remainingTime && (
                    <div className="form-group full-width">
                        <div className={`info-card ${remainingTime === 'Expired' ? 'danger' : 'success'}`}>
                            <span className="info-icon">⏱️</span>
                            <div>
                                <p className="info-label">Remaining Safe Time</p>
                                <p className="info-value">{remainingTime}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="form-group full-width">
                    <label htmlFor="storageCondition">Storage Condition <span className="required">*</span></label>
                    <select
                        id="storageCondition"
                        value={formData.storageCondition || ''}
                        onChange={(e) => handleChange('storageCondition', e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Select storage condition</option>
                        {storageConditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Allergens Present</label>
                    <p className="field-hint">Select all allergens present in this food</p>
                    <div className="allergen-grid">
                        {allergenOptions.map(allergen => (
                            <button
                                key={allergen}
                                type="button"
                                className={`allergen-btn ${(formData.allergens || []).includes(allergen) ? 'active' : ''}`}
                                onClick={() => toggleAllergen(allergen)}
                            >
                                {allergen}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group full-width">
                    <div className="warning-card">
                        <span className="warning-icon">⚠️</span>
                        <div>
                            <p className="warning-title">Safety Notice</p>
                            <p className="warning-text">
                                Food donations will be automatically rejected if they expire before pickup.
                                Please ensure accurate expiry information to help us serve those in need safely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyInfoStep;
