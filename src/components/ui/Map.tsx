import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../lib/types';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  locations?: Location[];
  height?: string;
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export const Map: React.FC<MapProps> = ({
  center = [51.505, -0.09],
  zoom = 13,
  locations = [],
  height = '400px',
  onLocationSelect,
  className,
}) => {
  return (
    <div style={{ height }} className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', z-index: '1' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          if (!location.coordinates) return null;
          
          return (
            <Marker
              key={location.id}
              position={[location.coordinates.latitude, location.coordinates.longitude]}
              eventHandlers={{
                click: () => onLocationSelect?.(location),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">{location.name}</p>
                  {location.parent && (
                    <p className="text-neutral-600">{location.parent.name}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        )}
      </MapContainer>
    </div>
  );
};