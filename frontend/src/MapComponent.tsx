import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import Icons from './components/DisasterIcons';
import { useTheme } from './components/theme-provider';

// Define style options
const STYLES = {
  'Dark OSINT': 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  'Default': 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  'Satellite': {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri'
      }
    },
    layers: [
      {
        id: 'satellite',
        type: 'raster',
        source: 'satellite-tiles',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  'Terrain': {
    version: 8,
    sources: {
      'terrain-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: 'Tiles &copy; OpenTopoMap'
      }
    },
    layers: [
      {
        id: 'terrain',
        type: 'raster',
        source: 'terrain-tiles',
        minzoom: 0,
        maxzoom: 17
      }
    ]
  }
};

interface MapComponentProps {
  earthquakes: any[];
  focusLocation?: [number, number] | null;
}

export default function MapComponent({ earthquakes, focusLocation }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  
  const { theme } = useTheme();
  const [currentStyle, setCurrentStyle] = useState<keyof typeof STYLES>(() => {
    const isDark = typeof window !== 'undefined' && window.document.documentElement.classList.contains('dark');
    return isDark ? 'Dark OSINT' : 'Default';
  });

  // Keep a ref to always have the latest earthquakes data in event handlers
  const earthquakesRef = useRef(earthquakes);
  useEffect(() => {
    earthquakesRef.current = earthquakes;
  }, [earthquakes]);

  // Handle flying to focused coordinates
  useEffect(() => {
    if (mapRef.current && focusLocation) {
      mapRef.current.flyTo({
        center: focusLocation,
        zoom: 6,
        speed: 1.5,
        curve: 1.2,
        essential: true
      });
    }
  }, [focusLocation]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map using current selected style
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLES[currentStyle] as any,
      center: [0, 0], // starting position [lng, lat]
      zoom: 2.5 // starting zoom
    });

    mapRef.current = map;

    // Apply the 3D globe projection initially and every time a style completes loading
    map.on('style.load', () => {
      map.setProjection({
        type: 'globe'
      });

      // Add earthquakes source if it doesn't exist
      if (!map.getSource('earthquakes')) {
        map.addSource('earthquakes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: earthquakesRef.current
          }
        });
      }

      // Add circle layer for visualization
      if (!map.getLayer('earthquakes-circles')) {
        map.addLayer({
          id: 'earthquakes-circles',
          type: 'circle',
          source: 'earthquakes',
          paint: {
            // Style size based on magnitude or severity
            'circle-radius': [
              'coalesce',
              ['get', 'radius'],
              [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'mag'], 5],
                5, 6,
                6, 12,
                7, 18,
                8, 26
              ]
            ],
            // Style color based on magnitude or disaster type
            'circle-color': [
              'coalesce',
              ['get', 'color'],
              [
                'match',
                ['get', 'disasterType'],
                'fire', '#ff4d4d',
                'flood', '#0070f3',
                'accident', '#f5a623',
                'earthquake', '#7928ca',
                [
                  'interpolate',
                  ['linear'],
                  ['coalesce', ['get', 'mag'], 0],
                  0, '#7928ca',
                  5, '#f5a623',
                  6, '#ff4d4d',
                  7, '#ee0000',
                  8, '#7928ca'
                ]
              ]
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.8,
            'circle-stroke-opacity': 0.9
          }
        });
      }

      // Add popups on click
      map.on('click', 'earthquakes-circles', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const geom = feature.geometry as any;
        if (!geom || !geom.coordinates) return;
        
        const coordinates = geom.coordinates.slice();
        const props = feature.properties as any;
        const type = props.disasterType || 'earthquake';
        const mag = props.mag ? Number(props.mag) : null;
        const place = props.place || 'Unknown location';
        const title = props.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Event`;
        const description = props.description || (mag ? `Seismic activity of magnitude ${mag.toFixed(1)} recorded.` : 'Emergency alert reported.');
        const status = props.status || 'active';
        const reportedBy = props.reportedBy || (mag ? 'USGS' : 'Citizen');
        const time = props.time ? Number(props.time) : Date.now();
        const date = new Date(time).toLocaleString();

        const colorMap: Record<string, string> = {
          fire: '#ff4d4d',
          flood: '#0070f3',
          earthquake: '#7928ca',
          accident: '#f5a623'
        };
        const badgeColor = colorMap[type] || '#7928ca';

        // Adjust coordinates if map is wrapped
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup({ closeButton: true, className: 'vercel-popup' })
          .setLngLat(coordinates)
          .setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 12px; min-width: 220px; border-radius: 8px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 8px;">
                <span style="
                  background: ${badgeColor};
                  color: white;
                  font-size: 10px;
                  font-weight: 700;
                  padding: 2px 6px;
                  border-radius: 4px;
                  text-transform: uppercase;
                  white-space: nowrap;
                ">
                  ${type} ${mag ? `• Mag ${mag.toFixed(1)}` : ''}
                </span>
                <span style="
                  font-size: 9px;
                  color: ${status === 'active' ? '#ee0000' : '#10b981'};
                  background: ${status === 'active' ? 'rgba(238, 0, 0, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
                  padding: 1px 6px;
                  border-radius: 4px;
                  font-weight: 700;
                  text-transform: uppercase;
                  border: 1px solid ${status === 'active' ? 'rgba(238, 0, 0, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
                  white-space: nowrap;
                ">
                  ${status}
                </span>
              </div>
              <div style="font-size: 13px; font-weight: 600; color: #171717; margin-bottom: 4px; line-height: 1.4;">
                ${title}
              </div>
              <div style="font-size: 11px; color: #4d4d4d; margin-bottom: 8px; line-height: 1.4;">
                ${description}
              </div>
              <div style="font-size: 11px; color: #888888; margin-bottom: 8px;">
                📍 ${place}
              </div>
              <div style="border-top: 1px solid #ebebeb; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; font-size: 9px; color: #888888; font-family: monospace;">
                <span>By: ${reportedBy}</span>
                <span>${date.split(',')[0]}</span>
              </div>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on hover
      map.on('mouseenter', 'earthquakes-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'earthquakes-circles', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update map source dynamically when earthquakes data changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('earthquakes') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: earthquakes
      });
    }
  }, [earthquakes]);

  // Update map style dynamically
  const selectStyle = (styleName: keyof typeof STYLES) => {
    setCurrentStyle(styleName);
    if (mapRef.current) {
      mapRef.current.setStyle(STYLES[styleName] as any);
    }
  };

  // Synchronize map style with application theme
  useEffect(() => {
    if (!mapRef.current) return;
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      selectStyle('Dark OSINT');
    } else {
      selectStyle('Default');
    }
  }, [theme]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={mapContainer} 
        style={{ width: '100%', height: '100%', background: '#090a0c' }} 
      />

      {/* Floating Modern Selector in top-right corner */}
      <div className="v-map-style-selector">
        <div className="v-map-style-title">
          Map Style
        </div>
        
        {(Object.keys(STYLES) as Array<keyof typeof STYLES>).map((styleName) => (
          <button
            key={styleName}
            onClick={() => selectStyle(styleName)}
            className={cn(
              "v-map-style-btn",
              currentStyle === styleName && "active"
            )}
          >
            <span>{styleName}</span>
            {currentStyle === styleName && (
              <Icons.check size={11} className="text-neutral-900 dark:text-white ml-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
