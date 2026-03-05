import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './LocationForm.css';

export default function LocationForm({ onClose, onAddLocation }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        city: '',
        date: '',
        title: '',
        description: '', // This will be markdown
        photos: '' // Comma separated URLs
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Forward Geocoding using free Nominatim API
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.city)}&format=json&limit=1`);
            const data = await res.json();

            if (!data || data.length === 0) {
                throw new Error("Could not find coordinates for this city.");
            }

            const newLoc = {
                id: `loc-${Date.now()}`,
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                name: formData.city,
                date: formData.date,
                title: formData.title,
                description: formData.description,
                photos: formData.photos ? formData.photos.split(',').map(url => url.trim()) : []
            };

            onAddLocation(newLoc);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="location-form-overlay">
            <div className="location-form-container glass-panel">
                <button className="close-btn" onClick={onClose} type="button">
                    <X size={20} />
                </button>

                <h2>{t('locationForm.title')}</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('locationForm.cityName')}</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder={t('locationForm.cityNamePlaceholder')} />
                    </div>

                    <div className="form-group">
                        <label>{t('locationForm.date')}</label>
                        <input required type="text" name="date" value={formData.date} onChange={handleChange} placeholder={t('locationForm.datePlaceholder')} />
                    </div>

                    <div className="form-group">
                        <label>{t('locationForm.title')}</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t('locationForm.traveloguePlaceholder')} />
                    </div>

                    <div className="form-group">
                        <label>{t('locationForm.description')}</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="5" placeholder={t('locationForm.descriptionPlaceholder')} />
                    </div>

                    <div className="form-group">
                        <label>{t('locationForm.photos')}</label>
                        <input type="text" name="photos" value={formData.photos} onChange={handleChange} placeholder={t('locationForm.photoUrlPlaceholder')} />
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="spinner" size={16} /></> : t('locationForm.save')}
                    </button>
                </form>
            </div>
        </div>
    );
}
