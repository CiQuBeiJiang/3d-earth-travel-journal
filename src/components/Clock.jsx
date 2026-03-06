import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Clock() {
    const [time, setTime] = useState(new Date());
    const { language } = useLanguage();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time (e.g., 14:08)
    const timeString = time.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // Format date (e.g., 2026年3月6日 周五 or Friday, March 6, 2026)
    const dateOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    let dateString = '';
    if (language === 'zh') {
        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const d = time.getDate();
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const day = days[time.getDay()];
        dateString = `${y}年${m}月${d}日 ${day}`;
    } else {
        dateString = time.toLocaleDateString('en-US', dateOptions);
    }

    return (
        <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            color: 'var(--text-primary)',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 10,
            pointerEvents: 'none', // Allow clicking through if necessary
            transition: 'color 0.3s ease'
        }}>
            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                lineHeight: '1',
                letterSpacing: '1px'
            }}>
                {timeString}
            </div>
            <div style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                opacity: 0.8,
                marginTop: '4px'
            }}>
                {dateString}
            </div>
        </div>
    );
}
