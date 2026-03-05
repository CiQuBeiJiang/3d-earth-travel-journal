import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useLanguage } from '../contexts/LanguageContext';
import './LocationDetails.css';

export default function LocationDetails({ location, onClose, onDelete }) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // We use this local state to trigger the slide in/out animation
    // while keeping the data populated for the exit animation.
    useEffect(() => {
        if (location) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [location]);

    // Keep rendering the panel but hide it if no location has EVER been selected.
    // The CSS will handle the transform to slide it off screen.

    return (
        <div className={`location-panel-container ${isOpen ? 'open' : ''}`}>
            <div className="location-details glass-panel">
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                {location ? (
                    <div className="content-wrapper">
                        <div className="header">
                            <h2>{location.name}</h2>
                            <div className="meta-tags">
                                <span className="tag"><MapPin size={14} /> {location.lat.toFixed(2)}, {location.lng.toFixed(2)}</span>
                                <span className="tag"><Calendar size={14} /> {location.date}</span>
                                {onDelete && (
                                    <button
                                        className="tag delete-btn"
                                        onClick={() => {
                                            if (window.confirm(t('locationDetails.deleteConfirm', { city: location.name }))) {
                                                onDelete(location.id);
                                            }
                                        }}
                                        style={{ background: 'rgba(255, 74, 74, 0.1)', color: '#ff4a4a', cursor: 'pointer', border: 'none' }}
                                        title={t('locationDetails.deleteConfirm', { city: '' })}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="scroll-content">
                            <h3>{location.title}</h3>
                            <div className="description markdown-body">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{location.description}</ReactMarkdown>
                            </div>

                            {location.photos && location.photos.length > 0 && (
                                <div className="photo-gallery">
                                    {location.photos.map((src, i) => (
                                        <div key={i} className="photo-card">
                                            <img src={src} alt={`${location.name} snapshot ${i + 1}`} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '24px' }}>Loading...</div>
                )}
            </div>
        </div>
    );
}
