import React, { useState } from 'react';
import Map, { MapLayerMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';

export default function MapPage() {
  const [location, setLocation] = useState({ city: '', state: '', coords: null });

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lngLat } = event;
    const [lon, lat] = [lngLat.lng, lngLat.lat];

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();

      const place = data.features.find((f: any) =>
        f.place_type.includes('place')
      );
      const region = data.features.find((f: any) =>
        f.place_type.includes('region')
      );

      setLocation({
        city: place?.text || 'Unknown City',
        state: region?.text || 'Unknown State',
        coords: { lat, lon },
      });
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  return (
    <div>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3,
        }}
        style={{ width: '100%', height: '500px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
      />
      {location.coords && (
        <div style={{ marginTop: '1rem' }}>
          <strong>City:</strong> {location.city} <br />
          <strong>State:</strong> {location.state} <br />
          <strong>Lat:</strong> {location.coords.lat.toFixed(4)} <br />
          <strong>Lon:</strong> {location.coords.lon.toFixed(4)}
        </div>
      )}
    </div>
  );
}
