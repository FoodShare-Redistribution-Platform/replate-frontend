import React from 'react';

const FoodDetailsStep = ({ formData, updateFormData }) => {
    const foodTypes = [
        'Cooked Meals',
        'Raw Vegetables',
        'Fruits',
        'Bakery Items',
        'Packaged Food',
        'Dairy Products',
        'Beverages',
        'Other'
    ];

    const units = ['servings', 'kg', 'packets', 'pieces', 'liters'];
    const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'];

    const handleChange = (field, value) => {
        updateFormData({ [field]: value });
    };

    const toggleDietaryTag = (tag) => {
        const currentTags = formData.dietaryTags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        updateFormData({ dietaryTags: newTags });
    };

    return (
        <div className="step-content">
            <div className="step-header">
                <div className="step-icon-box">
                    <span className="step-emoji">🍽️</span>
                </div>
                <div>
                    <h2 className="step-title">Food Details</h2>
                    <p className="step-description">Describe the food you're donating</p>
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="foodType">Food Type <span className="required">*</span></label>
                    <select
                        id="foodType"
                        value={formData.foodType || ''}
                        onChange={(e) => handleChange('foodType', e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Select food type</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="foodName">Food Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="foodName"
                        value={formData.foodName || ''}
                        onChange={(e) => handleChange('foodName', e.target.value)}
                        className="form-input"
                        placeholder="e.g., Vegetable Biryani"
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="form-textarea"
                        rows="3"
                        placeholder="Describe the food items, ingredients, and any other relevant details..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                    <input
                        type="number"
                        id="quantity"
                        value={formData.quantity || ''}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        className="form-input"
                        placeholder="e.g., 50"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="unit">Unit <span className="required">*</span></label>
                    <select
                        id="unit"
                        value={formData.unit || 'servings'}
                        onChange={(e) => handleChange('unit', e.target.value)}
                        className="form-select"
                    >
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estimatedServings">Estimated Servings <span className="required">*</span></label>
                    <input
                        type="number"
                        id="estimatedServings"
                        value={formData.estimatedServings || ''}
                        onChange={(e) => handleChange('estimatedServings', e.target.value)}
                        className="form-input"
                        placeholder="e.g., 50"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label>Dietary Information</label>
                    <div className="dietary-tags">
                        {dietaryOptions.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                className={`tag-btn ${(formData.dietaryTags || []).includes(tag) ? 'active' : ''}`}
                                onClick={() => toggleDietaryTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="foodPhoto">Food Photos (Optional)</label>
                    <div className="upload-box">
                        <input
                            type="file"
                            id="foodPhoto"
                            accept="image/*"
                            className="file-input-hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    // Validate file size (max 5MB)
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert('File size must be less than 5MB');
                                        e.target.value = '';
                                        return;
                                    }

                                    // Validate file type
                                    if (!file.type.startsWith('image/')) {
                                        alert('Please select an image file');
                                        e.target.value = '';
                                        return;
                                    }

                                    // Convert to base64
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        handleChange('foodPhoto', reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {formData.foodPhoto ? (
                            <div className="image-preview-container">
                                <img
                                    src={formData.foodPhoto}
                                    alt="Food preview"
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => {
                                        handleChange('foodPhoto', null);
                                        document.getElementById('foodPhoto').value = '';
                                    }}
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="foodPhoto" className="upload-label">
                                <span className="upload-icon">📷</span>
                                <p>Click to upload or drag and drop</p>
                                <p className="upload-hint">PNG, JPG up to 5MB</p>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailsStep;
