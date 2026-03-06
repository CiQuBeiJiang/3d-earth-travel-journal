import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { X, Keyboard, Maximize, PauseCircle, MonitorX } from 'lucide-react';

export default function ShortcutModal({ onClose }) {
    const { t } = useLanguage();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const shortcutItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        marginBottom: '12px'
    };

    const keyStyle = {
        background: 'var(--accent-color)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
        flexShrink: 0
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }}>
            <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '350px',
                color: 'var(--text-primary)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.2s ease-out'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Keyboard size={24} />
                        {t('shortcuts.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={shortcutItemStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <PauseCircle size={20} color="var(--accent-color)" />
                            <span>{t('shortcuts.pauseRotation')}</span>
                        </div>
                        <span style={keyStyle}>{t('shortcuts.spacebar')}</span>
                    </div>

                    <div style={shortcutItemStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MonitorX size={20} color="var(--accent-color)" />
                            <span>{t('shortcuts.closePanel')}</span>
                        </div>
                        <span style={keyStyle}>{t('shortcuts.escape')}</span>
                    </div>

                    <div style={shortcutItemStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Maximize size={20} color="var(--accent-color)" />
                            <span>{t('shortcuts.toggleImmersive')}</span>
                        </div>
                        <span style={keyStyle}>{t('shortcuts.ctrlH')}</span>
                    </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {t('app.title') === 'My Travel ' ? 'Pro Tip: Exploring the earth is better in full screen!' : '提示：沉浸全屏模式下体验地球更佳！'}
                </div>
            </div>
        </div>
    );
}
