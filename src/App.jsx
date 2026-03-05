import React, { useState, useEffect } from 'react';
import Earth from './components/Earth';
import BackgroundElements from './components/BackgroundElements';
import LocationDetails from './components/LocationDetails';
import LocationForm from './components/LocationForm';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Moon, Sun, Plus, Play, Square, Eye, EyeOff } from 'lucide-react';
import { travelData } from './data/travelData';
import './App.css';

function MainApp() {
  const [locations, setLocations] = useState(travelData);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);

  // Journey playback state
  const [routeArcs, setRouteArcs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackAborter, setPlaybackAborter] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') {
        setIsImmersive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddLocation = (newLoc) => {
    setLocations(prev => [...prev, newLoc]);
    setSelectedLocation(newLoc); // Auto open details for the new location
  };

  const handleDeleteLocation = (id) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    setSelectedLocation(null);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleClosePanel = () => {
    setSelectedLocation(null);
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

  return (
    <div className="app-container">
      {/* Background Layer */}
      <BackgroundElements />

      {/* 3D Earth Layer */}
      <Earth markers={locations} arcs={routeArcs} onMarkerClick={handleMarkerClick} />

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
            <span>Exit Immersive</span>
          </button>
        </div>
      )}

      {/* Floating UI Layer */}
      {!isImmersive && (
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
          <div>
            <h1 style={{ fontWeight: 600, fontSize: '1.8rem', letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              My Travel <span style={{ color: 'var(--accent-color)' }}>Log</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Explore the globe to see my memories. <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>(Press H to hide UI)</span>
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', pointerEvents: 'auto' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
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
              {theme === 'sky' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'sky' ? 'Space' : 'Sky'}</span>
            </button>

            {/* Immersive Mode Button */}
            <button
              onClick={() => setIsImmersive(true)}
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
              title="Hide UI (Shortcut: H or ESC)"
            >
              <Eye size={16} />
              <span>Immersive</span>
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
              <span>Add Memory</span>
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
              <span>{isPlaying ? 'Stop' : 'Play Journey'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Sidebar for Location Details */}
      <LocationDetails
        location={!isImmersive ? selectedLocation : null}
        onClose={handleClosePanel}
        onDelete={handleDeleteLocation}
      />

      {/* Add Location Form Overlay */}
      {isFormOpen && <LocationForm onClose={() => setIsFormOpen(false)} onAddLocation={handleAddLocation} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;
