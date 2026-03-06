import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';
import { useTags } from '../contexts/TagContext';

export default function Earth({ markers, arcs = [], onMarkerClick, autoRotate = true, resetCamera = false, focusedLocationId = null }) {
    const globeRef = useRef();
    const cloudsRef = useRef(null);
    const ambientLightRef = useRef(null);
    const { theme } = useTheme();
    const { tags } = useTags();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Configure initial globe camera and rotation
    useEffect(() => {
        if (globeRef.current) {
            // Setup auto-rotate
            const controls = globeRef.current.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.7;
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
            }

            // Set initial camera position back a bit to see the whole earth
            globeRef.current.pointOfView({ altitude: 2.2 }, 0);
        }
    }, []);

    // Update auto-rotate when prop changes
    useEffect(() => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            if (controls) {
                controls.autoRotate = autoRotate;
            }
        }
    }, [autoRotate]);

    // Reset camera to global view when requested
    useEffect(() => {
        if (resetCamera && globeRef.current) {
            globeRef.current.pointOfView({ altitude: 2.2 }, 1000);
        }
    }, [resetCamera]);

    // Helper to apply lighting and cloud opacity based on theme
    const applyThemeSettings = React.useCallback((currentTheme) => {
        if (cloudsRef.current) {
            // Hide clouds in space mode so they don't wash out the night lights
            cloudsRef.current.material.opacity = currentTheme === 'space' ? 0 : 0.4;
        }
        if (ambientLightRef.current) {
            // Significantly boost ambient light in space mode so the dark side and city lights are highly visible
            // In sky mode, keep it lower so the directional sunlight creates realistic day/night cycles
            ambientLightRef.current.intensity = currentTheme === 'space' ? 4.5 : 0.8;
        }
    }, []);

    // Update settings when theme changes
    useEffect(() => {
        applyThemeSettings(theme);
    }, [theme, applyThemeSettings]);

    // Enhance Earth Material and Add Clouds after a short delay to ensure Globe is ready
    useEffect(() => {
        let animationFrameId;
        const initEnhancements = () => {
            if (!globeRef.current) return;

            try {
                // Enhance Earth Material (Specular Reflections & 3D Terrain Displacement)
                const globeMaterial = globeRef.current.globeMaterial ? globeRef.current.globeMaterial() : null;
                if (globeMaterial) {
                    globeMaterial.bumpScale = 10;

                    // True 3D Displacement (elevation)
                    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/earth-topology.png`, texture => {
                        globeMaterial.displacementMap = texture;
                        globeMaterial.displacementScale = 3; // Adjust for mountain height intensity
                        globeMaterial.displacementBias = -0.5; // Keeps sea level normal
                    });

                    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/earth-water.png`, texture => {
                        globeMaterial.specularMap = texture;
                        globeMaterial.specular = new THREE.Color('grey');
                        globeMaterial.shininess = 15;
                    });
                }

                // Add Dynamic Cloud Layer using a realistic cloud texture
                const CLOUDS_IMG_URL = `${import.meta.env.BASE_URL}textures/earth-clouds.png`;
                new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
                    if (!globeRef.current) return;

                    // react-globe.gl base radius is typically 100
                    const radius = globeRef.current.getGlobeRadius ? globeRef.current.getGlobeRadius() : 100;

                    const cloudMaterial = new THREE.MeshBasicMaterial({
                        map: cloudsTexture,
                        transparent: true,
                        opacity: 0.4,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false, // Prevents depth sorting issues with the transparent layer
                        side: THREE.DoubleSide
                    });

                    const clouds = new THREE.Mesh(
                        new THREE.SphereGeometry(radius * 1.02, 64, 64),
                        cloudMaterial
                    );

                    const scene = globeRef.current.scene ? globeRef.current.scene() : null;
                    if (scene) {
                        scene.add(clouds);
                        cloudsRef.current = clouds;

                        // Create a custom ambient light to control brightness
                        if (!ambientLightRef.current) {
                            const light = new THREE.AmbientLight(0xffffff, 1.2);
                            scene.add(light);
                            ambientLightRef.current = light;
                        }

                        // Apply current theme settings immediately
                        applyThemeSettings(theme);

                        // Simple animation loop for clouds (rotate slightly faster than the earth for drift effect)
                        const rotateClouds = () => {
                            if (clouds) clouds.rotation.y += 0.00045 * Math.PI;
                            animationFrameId = requestAnimationFrame(rotateClouds);
                        };
                        rotateClouds();
                    }
                });
            } catch (e) {
                console.error("Error enhancing globe:", e);
            }
        };

        const timer = setTimeout(initEnhancements, 1000); // 1s delay to wait for three-globe internal init

        return () => {
            clearTimeout(timer);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [theme, applyThemeSettings]);

    // Use rings data for markers to have a cool pulse effect
    const ringData = useMemo(() => {
        return markers.map(marker => ({
            ...marker,
            lat: marker.lat,
            lng: marker.lng,
            maxR: 4,      // Size of the pulse ring
            propagationSpeed: 1.5,
            repeatPeriod: 1000
        }));
    }, [markers]);

    return (
        <div style={{ width: '100%', height: '100%', cursor: 'grab', position: 'relative', zIndex: 5 }}>
            <Globe
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                // Switch to 8k/4k earth textures based on theme
                globeImageUrl={theme === 'space' ? `${import.meta.env.BASE_URL}textures/earth-night.jpg` : `${import.meta.env.BASE_URL}textures/earth-blue-marble.jpg`}
                bumpImageUrl={`${import.meta.env.BASE_URL}textures/earth-topology.png`}
                backgroundImageUrl=""
                backgroundColor="rgba(0,0,0,0)"

                // Atmosphere layer (Thicker/brighter logic based on theme)
                atmosphereColor={theme === 'space' ? "rgba(164, 188, 255, 0.7)" : "rgba(135, 206, 235, 0.8)"}
                atmosphereAltitude={theme === 'space' ? 0.25 : 0.25}

                // Custom HTML elements as glowing pins
                htmlElementsData={markers}
                htmlElement={d => {
                    const parent = document.createElement('div');
                    parent.style.pointerEvents = 'none'; // Prevent parent from blocking clicks

                    const el = document.createElement('div');
                    el.style.pointerEvents = 'auto'; // allow inner to be clickable

                    let iconContent = '📍';
                    let bgColor = 'var(--accent-color)';

                    if (d.tags && d.tags.length > 0) {
                        const firstTag = tags.find(t => t.id === d.tags[0]);
                        if (firstTag) {
                            iconContent = firstTag.icon;
                            bgColor = firstTag.color;
                        }
                    }

                    const isFocused = focusedLocationId === d.id;

                    el.innerHTML = `
            <div style="
              width: 32px; 
              height: 32px; 
              background-color: ${bgColor}; 
              border-radius: 50%; 
              border: 2px solid white;
              box-shadow: 0 0 ${isFocused ? '30px' : '15px'} ${bgColor}${isFocused ? ', 0 0 10px white' : ''};
              transform: ${isFocused ? 'scale(1.4)' : 'scale(1)'};
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            ">${iconContent}</div>
          `;

                    el.onmouseenter = () => {
                        if (isFocused) return;
                        el.firstElementChild.style.transform = 'scale(1.4)';
                        el.firstElementChild.style.boxShadow = `0 0 30px ${bgColor}, 0 0 10px white`;
                        if (globeRef.current) globeRef.current.controls().autoRotate = false;
                    };
                    el.onmouseleave = () => {
                        if (isFocused) return;
                        el.firstElementChild.style.transform = 'scale(1)';
                        el.firstElementChild.style.boxShadow = `0 0 15px ${bgColor}`;
                        if (globeRef.current) globeRef.current.controls().autoRotate = autoRotate;
                    };
                    el.onclick = () => {
                        // Re-center camera on the clicked point
                        globeRef.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.5 }, 1200);
                        onMarkerClick(d);
                    };

                    parent.appendChild(el);
                    return parent;
                }}
                htmlAltitude={0.01}

                // Time-lapse Journey Arcs
                arcsData={arcs}
                arcColor={() => theme === 'space' ? "rgba(255, 255, 255, 0.8)" : "rgba(49, 130, 206, 0.8)"}
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={1500}
                arcStroke={1.5}
                arcAltitudeAutoScale={0.2}

                // Animated Rings at marker locations
                ringsData={ringData}
                ringColor={() => t => `rgba(100, 108, 255, ${Math.sqrt(1 - t)})`}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
            />
        </div>
    );
}
