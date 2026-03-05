import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './BackgroundElements.css';

export default function BackgroundElements() {
    const { theme } = useTheme();

    return (
        <div className={`background-container ${theme}-bg`}>
            {theme === 'sky' && (
                <>
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                    <div className="cloud cloud-3"></div>
                    <div className="bird-flock">
                        <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                            <path d="M0 10 Q 10 0 20 10 Q 30 0 40 10 Q 30 5 20 15 Q 10 5 0 10 Z" fill="rgba(0,0,0,0.4)" />
                        </svg>
                    </div>
                </>
            )}
            {theme === 'space' && (
                <>
                    <div className="stars"></div>
                    <div className="twinkling"></div>
                    <div className="nebula"></div>
                </>
            )}
        </div>
    );
}
