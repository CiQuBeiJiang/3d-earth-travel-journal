import React, { useState, useEffect } from 'react';
import Earth from './components/Earth';
import BackgroundElements from './components/BackgroundElements';
import LocationDetails from './components/LocationDetails';
import LocationForm from './components/LocationForm';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { TagProvider, useTags } from './contexts/TagContext';
import { Plus, Play, Square, EyeOff, Settings, Keyboard, ChevronDown } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import ShortcutModal from './components/ShortcutModal';
import Clock from './components/Clock';
import { travelData } from './data/travelData';
import './App.css';

function MainApp() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  const { tags } = useTags();

  // Journey playback state
  const [routeArcs, setRouteArcs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const { t } = useLanguage();

  // Load persistent data from Electron filesystem
  useState(() => {
    if (!window.electronAPI) {
      setLocations(travelData); // Fallback for normal browser
    }
  });

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getLocations().then(data => setLocations(data));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts when editing forms
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsImmersive(prev => !prev);
      } else if (e.key === 'Escape') {
        setSelectedLocation(null);
      } else if (e.code === 'Space') {
        e.preventDefault();
        setAutoRotate(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddLocation = (newLoc) => {
    const newLocations = [...locations, newLoc];
    setLocations(newLocations);
    setSelectedLocation(newLoc); // Auto open details for the new location

    // Save to persistent local storage
    if (window.electronAPI) {
      window.electronAPI.saveLocations(newLocations);
    }
  };

  const handleDeleteLocation = (id) => {
    const newLocations = locations.filter(loc => loc.id !== id);
    setLocations(newLocations);
    setSelectedLocation(null);

    // Save to persistent local storage
    if (window.electronAPI) {
      window.electronAPI.saveLocations(newLocations);
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setIsFocused(true);
    setAutoRotate(false);
  };

  const handleExitFocus = () => {
    setIsFocused(false);
    setSelectedLocation(null);
    setAutoRotate(true);
  };

  const handleClosePanel = () => {
    setSelectedLocation(null);
    // Do not exit focus or auto-rotate automatically when just closing panel
  };

  const playJourney = async () => {
    if (locations.length < 2 || isPlaying) return;
    setIsPlaying(true);
    setRouteArcs([]);
    setSelectedLocation(null);

    const arcs = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const start = locations[i];
      const end = locations[i + 1];

      setSelectedLocation(start);

      // Wait at location to read
      await new Promise(r => setTimeout(r, 2500));

      // Draw path to next point
      arcs.push({
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng
      });
      setRouteArcs([...arcs]);

      // Wait for travel animation duration
      await new Promise(r => setTimeout(r, 1500));
    }

    // Arrive at final location
    setSelectedLocation(locations[locations.length - 1]);
    await new Promise(r => setTimeout(r, 3000));

    setIsPlaying(false);
    setRouteArcs([]);
  };

  const visibleLocations = activeTag ? locations.filter(loc => loc.tags && loc.tags.includes(activeTag)) : locations;

  return (
    <div className="app-container">
      {/* Background Layer */}
      <BackgroundElements />

      {/* 3D Earth Layer */}
      <Earth
        markers={visibleLocations}
        arcs={routeArcs}
        onMarkerClick={handleMarkerClick}
        autoRotate={autoRotate}
        resetCamera={!isFocused}
        focusedLocationId={isFocused && selectedLocation ? selectedLocation.id : null}
      />

      {/* Floating Exit Focus Button */}
      {isFocused && !isImmersive && (
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <button
            onClick={handleExitFocus}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(100, 108, 255, 0.8)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '30px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(100, 108, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            🌍 {t('app.title') === 'My Travel ' ? 'Back to Global View' : '返回全局视角'}
          </button>
        </div>
      )}

      {/* Floating Exit Immersive Button (only visible when immersive and mouse hovers near top left) */}
      {isImmersive && (
        <div
          className="exit-immersive-zone"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '150px',
            height: '150px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '24px'
          }}
        >
          <button
            onClick={() => setIsImmersive(false)}
            className="exit-immersive-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'opacity 0.3s',
              opacity: 0
            }}
          >
            <EyeOff size={16} />
            <span>{t('app.exitImmersive')}</span>
          </button>
        </div>
      )}

      {/* Floating UI Layer */}
      {!isImmersive && (
        <>
          <Clock />
          <div className="ui-overlay" style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <style>{`
            .hide-scrollbar-container::-webkit-scrollbar { display: none; }
            .hide-scrollbar-container { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
            <div>
              <h1 style={{ fontWeight: 600, fontSize: '1.8rem', letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {t('app.title')}<span style={{ color: 'var(--accent-color)' }}>{t('app.titleHighlight')}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {t('app.subtitle')} <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{t('app.shortcutHint')}</span>
              </p>
            </div>

            {/* Tag Filter Dropdown */}
            <div style={{ position: 'relative', pointerEvents: 'auto', width: 'fit-content', maxWidth: '160px' }}>
              <select
                value={activeTag || ''}
                onChange={(e) => setActiveTag(e.target.value || null)}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontFamily: 'inherit',
                  textOverflow: 'ellipsis'
                }}
              >
                <option value="" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                  {t('app.title') === 'My Travel ' ? 'All Memories' : '全部记忆'}
                </option>
                {tags.map(tag => {
                  const tl = t(`tags.${tag.label.toLowerCase()}`);
                  const displayLabel = tl.startsWith('tags.') ? tag.label : tl;
                  return (
                    <option key={tag.id} value={tag.id} style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                      {tag.icon} {displayLabel}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                size={16}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', pointerEvents: 'auto' }}>
              {/* Shortcuts Guide Button */}
              <button
                onClick={() => setIsShortcutModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '50%',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                title={t('shortcuts?.title') || 'Shortcuts'}
              >
                <Keyboard size={18} />
              </button>

              {/* Settings Menu Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '20px',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                <Settings size={16} />
                <span>{t('app.settings')}</span>
              </button>

              <button
                onClick={() => setIsFormOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'var(--accent-color)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(100, 108, 255, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>{t('app.addMemory')}</span>
              </button>

              <button
                onClick={isPlaying ? () => setIsPlaying(false) : playJourney}
                disabled={locations.length < 2 && !isPlaying}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: isPlaying ? '#ff4a4a' : '#4caf50',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  cursor: (locations.length < 2 && !isPlaying) ? 'not-allowed' : 'pointer',
                  opacity: (locations.length < 2 && !isPlaying) ? 0.5 : 1
                }}
              >
                {isPlaying ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
                <span>{isPlaying ? t('app.stop') : t('app.playJourney')}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide-out Sidebar for Location Details */}
      <LocationDetails
        location={!isImmersive ? selectedLocation : null}
        onClose={handleClosePanel}
        onDelete={handleDeleteLocation}
      />

      {/* Add Location Form Overlay */}
      {isFormOpen && <LocationForm onClose={() => setIsFormOpen(false)} onAddLocation={handleAddLocation} />}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <SettingsPanel
          onClose={() => setIsSettingsOpen(false)}
          isImmersive={isImmersive}
          setIsImmersive={setIsImmersive}
        />
      )}

      {/* Shortcut Modal */}
      {isShortcutModalOpen && (
        <ShortcutModal onClose={() => setIsShortcutModalOpen(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <TagProvider>
          <MainApp />
        </TagProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
