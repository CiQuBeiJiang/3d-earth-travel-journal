import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTags } from '../contexts/TagContext';
import './LocationForm.css';

export default function LocationForm({ onClose, onAddLocation }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        city: '',
        date: '',
        title: '',
        description: '', // This will be markdown
        tag: '', // Store selected tag ID
        photos: [] // Array of local file paths
    });

    const { tags } = useTags();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPhotos = async () => {
        if (window.electronAPI) {
            const paths = await window.electronAPI.selectImages();
            if (paths && paths.length > 0) {
                setFormData(prev => ({ ...prev, photos: [...prev.photos, ...paths] }));
            }
        } else {
            alert("Local file selection is only available in the Desktop App.");
        }
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
                tags: [formData.tag].filter(Boolean),
                photos: formData.photos
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
                        <label>{t('locationForm.tags')}</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {tags.map(tag => {
                                const tl = t(`tags.${tag.label.toLowerCase()}`);
                                const displayLabel = tl.startsWith('tags.') ? tag.label : tl;
                                return (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tag: tag.id }))}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: formData.tag === tag.id ? 'var(--accent-color)' : 'var(--glass-border)',
                                            background: formData.tag === tag.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                            color: formData.tag === tag.id ? 'white' : 'var(--text-primary)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: formData.tag === tag.id ? `0 0 10px ${tag.color}60` : 'none'
                                        }}
                                    >
                                        <span>{tag.icon}</span>
                                        <span style={{ fontSize: '0.9rem' }}>{displayLabel}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('locationForm.selectPhotos')}</label>
                        <button
                            type="button"
                            onClick={handleSelectPhotos}
                            style={{
                                padding: '10px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px dashed rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            {t('locationForm.selectPhotosPlaceholder')}
                        </button>

                        {/* Image Previews */}
                        {formData.photos.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {formData.photos.map((photo, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        <img src={photo} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="spinner" size={16} /></> : t('locationForm.save')}
                    </button>
                </form>
            </div>
        </div>
    );
}
