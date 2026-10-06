import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default s in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SimpleMap = ({ center, zoom = 15, markers = [] }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const el = mapRef.current;
    // More robust center validation with fallback to default center
    const defaultCenter = { lat: 36.8188, lng: 10.166 };
    const safeCenter = center && typeof center.lat === 'number' && typeof center.lng === 'number' 
      ? center 
      : defaultCenter;

    // If container not ready, postpone
    if (!el) {
      return;
    }

    const initMapIfNeeded = () => {
      if (!mapInstance.current && el) {
        // Only init if the element has a non-zero size to avoid _leaflet_pos issues
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        if (width === 0 || height === 0) {
          // Try again shortly when layout stabilizes
          setTimeout(initMapIfNeeded, 100);
          return;
        }

        mapInstance.current = L.map(el);

        // Add tile layer first
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance.current);

        // Set initial view with safe center
        try {
          mapInstance.current.setView([safeCenter.lat, safeCenter.lng], zoom);
        } catch (error) {
          console.error('Error setting map view:', error);
        }

        // Invalidate size after mount to ensure proper layout
        setTimeout(() => {
          try { mapInstance.current && mapInstance.current.invalidateSize(); } catch {}
        }, 120);
      }
    };

    initMapIfNeeded();

    // Update markers and view
    if (mapInstance.current) {
      try {
        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstance.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add center marker with safe center
        try {
          const centerMarker = L.marker([safeCenter.lat, safeCenter.lng]).addTo(mapInstance.current);
          markersRef.current.push(centerMarker);
        } catch (error) {
          console.error('Error adding center marker:', error);
        }

        // Add custom markers if provided
        if (markers && markers.length > 0) {
          markersRef.current = markers.map(marker => {
            try {
              const m = L.marker(
                [marker.position.lat, marker.position.lng],
                {
                  icon: L.icon({
                    iconUrl: marker.hospitalData?.type === 'university' 
                      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
                      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  })
                }
              ).addTo(mapInstance.current);
              
              if (marker.popup) {
                m.bindPopup(marker.popup, {
                  maxWidth: 300,
                  minWidth: 250,
                  closeButton: true,
                  autoClose: false,
                  closeOnClick: false,
                  className: 'hospital-popup-container'
                });
              }
              
              // Add click handlers
              if (marker.onClick) {
                m.on('click', marker.onClick);
              }
              
              if (marker.onDblClick) {
                m.on('dblclick', marker.onDblClick);
              }
              
              return m;
            } catch (error) {
              console.warn('Error creating marker:', error);
              return null;
            }
          }).filter(Boolean); // Remove any null markers from errors
        }

        // Fit bounds or set view
        if (markersRef.current.length > 1) {
          const group = L.featureGroup(markersRef.current);
          mapInstance.current.fitBounds(group.getBounds().pad(0.1));
        } else {
          mapInstance.current.setView([center.lat, center.lng], zoom);
        }

        // Invalidate after updates (e.g., after panels expand)
        setTimeout(() => {
          try { mapInstance.current && mapInstance.current.invalidateSize(); } catch {}
        }, 50);
      } catch {}
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch {}
        mapInstance.current = null;
      }
    };
  }, [center, zoom, markers]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%', minHeight: '300px' }} />;
};

SimpleMap.defaultProps = {
  center: { lat: 36.8188, lng: 10.166 },
  zoom: 15,
  markers: []
};

export default SimpleMap;
