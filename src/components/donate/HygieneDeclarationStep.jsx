import React from 'react';

const HygieneDeclarationStep = ({ formData, updateFormData }) => {
    const hygieneChecks = [
        {
            key: 'safeHandling',
            title: 'Safe Food Handling',
            description: 'Food was prepared following proper hygiene practices with clean hands and utensils'
        },
        {
            key: 'temperatureControl',
            title: 'Temperature Control',
            description: 'Food was stored at appropriate temperatures to prevent bacterial growth'
        },
        {
            key: 'properPackaging',
            title: 'Proper Packaging',
            description: 'Food is packaged in clean, food-grade containers suitable for transport'
        },
        {
            key: 'noContamination',
            title: 'No Cross-Contamination',
            description: 'Food was kept separate from raw ingredients and potential contaminants'
        }
    ];

    const handleToggle = (key) => {
        const currentHygiene = formData.hygiene || {};
        updateFormData({
            hygiene: {
                ...currentHygiene,
                [key]: !currentHygiene[key]
            }
        });
    };

    const allConfirmed = hygieneChecks.every(
        check => formData.hygiene?.[check.key] === true
    );

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-icon-box">
                    <span className="step-emoji">✓</span>
                </div>
                <div>
                    <h2 className="step-title">Hygiene Declaration</h2>
                    <p className="step-description">Confirm food safety standards</p>
                </div>
            </div>

            <div className="hygiene-intro">
                <p>
                    To ensure the safety of food recipients, please confirm that your donation
                    meets all hygiene standards. All declarations are mandatory.
                </p>
            </div>

            <div className="hygiene-checks">
                {hygieneChecks.map((check) => (
                    <div key={check.key} className="hygiene-card">
                        <div className="hygiene-header">
                            <h3 className="hygiene-title">{check.title}</h3>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.hygiene?.[check.key] || false}
                                    onChange={() => handleToggle(check.key)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <p className="hygiene-description">{check.description}</p>
                        {formData.hygiene?.[check.key] && (
                            <div className="hygiene-confirmed">
                                <span className="check-icon">✓</span>
                                <span>Confirmed</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {allConfirmed ? (
                <div className="status-card success">
                    <span className="status-icon">✓</span>
                    <div>
                        <p className="status-title">All Standards Confirmed</p>
                        <p className="status-text">
                            Thank you for ensuring food safety. You may proceed to the next step.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="status-card warning">
                    <span className="status-icon">⚠️</span>
                    <div>
                        <p className="status-title">Confirmation Required</p>
                        <p className="status-text">
                            Please confirm all hygiene standards before proceeding.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HygieneDeclarationStep;
