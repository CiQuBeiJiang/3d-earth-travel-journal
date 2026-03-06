import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useLanguage } from '../contexts/LanguageContext';
import { useTags } from '../contexts/TagContext';
import './LocationDetails.css';

export default function LocationDetails({ location, onClose, onDelete }) {
    const { t } = useLanguage();
    const { tags } = useTags();
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

                            {location.tags && location.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    {location.tags.map(tagId => {
                                        const tagObj = tags.find(x => x.id === tagId);
                                        if (!tagObj) return null;
                                        const tl = t(`tags.${tagObj.label.toLowerCase()}`);
                                        const displayLabel = tl.startsWith('tags.') ? tagObj.label : tl;
                                        return (
                                            <span key={tagObj.id} style={{
                                                background: `${tagObj.color}20`,
                                                color: tagObj.color,
                                                border: `1px solid ${tagObj.color}60`,
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {tagObj.icon} {displayLabel}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

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
                                <div className="photo-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '16px' }}>
                                    {location.photos.map((src, i) => (
                                        <div key={i} className="photo-card" style={{ aspectRatio: '1', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                                            <img src={src} alt={`${location.name} snapshot ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
