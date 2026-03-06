import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { X, Globe, Download, Upload } from 'lucide-react';

export default function SettingsPanel({ onClose, isImmersive, setIsImmersive }) {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

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
                maxWidth: '400px',
                color: 'var(--text-primary)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{t('settings.title')}</h2>
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

                {/* Language Settings */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        {t('settings.language')}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setLanguage('en')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: language === 'en' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                color: language === 'en' ? 'white' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: language === 'en' ? 'var(--accent-color)' : 'var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('zh')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: language === 'zh' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                color: language === 'zh' ? 'white' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: language === 'zh' ? 'var(--accent-color)' : 'var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            中文
                        </button>
                    </div>
                </div>

                {/* Theme Settings */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        {t('settings.theme')}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => { if (theme !== 'sky') toggleTheme(); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: theme === 'sky' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                color: theme === 'sky' ? 'white' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: theme === 'sky' ? 'var(--accent-color)' : 'var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('settings.themeSky')}
                        </button>
                        <button
                            onClick={() => { if (theme !== 'space') toggleTheme(); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: theme === 'space' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                color: theme === 'space' ? 'white' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: theme === 'space' ? 'var(--accent-color)' : 'var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t('settings.themeSpace')}
                        </button>
                    </div>
                </div>

                {/* Font Size Settings */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        {t('settings.fontSize.title')}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['small', 'medium', 'large'].map(size => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: fontSize === size ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                                    color: fontSize === size ? 'white' : 'var(--text-primary)',
                                    border: '1px solid',
                                    borderColor: fontSize === size ? 'var(--accent-color)' : 'var(--glass-border)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: size === 'small' ? '0.8rem' : size === 'medium' ? '1rem' : '1.2rem'
                                }}
                            >
                                {t(`settings.fontSize.${size}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Immersive Mode Toggle */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{t('settings.immersive')}</span>
                        <button
                            onClick={() => {
                                setIsImmersive(!isImmersive);
                                onClose(); // Close settings to see the immersive effect
                            }}
                            style={{
                                background: isImmersive ? '#4caf50' : 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '16px',
                                width: '44px',
                                height: '24px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '2px',
                                left: isImmersive ? '22px' : '2px',
                                transition: 'left 0.3s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                        {t('settings.dataManagement')}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={async () => {
                                if (window.electronAPI) {
                                    const result = await window.electronAPI.exportData();
                                    if (result.success) alert(t('app.title') === 'My Travel ' ? 'Backup Exported Successfully!' : '备份导出成功！');
                                }
                            }}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Download size={16} />
                            {t('settings.exportBackup')}
                        </button>
                        <button
                            onClick={async () => {
                                if (window.electronAPI) {
                                    const result = await window.electronAPI.importData();
                                    if (result.success) {
                                        alert(t('app.title') === 'My Travel ' ? 'Backup Imported! App will restart.' : '备份导入成功！即将重启应用。');
                                        window.location.reload();
                                    }
                                }
                            }}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Upload size={16} />
                            {t('settings.importBackup')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
