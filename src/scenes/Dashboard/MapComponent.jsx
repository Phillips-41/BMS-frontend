import React from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';

const MapComponent = ({ mapMarkers }) => {
  const [selectedMarker, setSelectedMarker] = React.useState(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4">
      <GoogleMap
        center={{ lat: 17.4065, lng: 78.4772 }}
        zoom={5}
        mapContainerStyle={{ height: '430px', width: '100%' }}
      >
        {mapMarkers.map((marker, index) => {
          const iconColor = marker.statusType === 1 ? 'green' : (marker.statusType === 0 ? 'red' : 'yellow');

          return (
            <Marker
              key={index}
              position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
              icon={{
                url: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-${iconColor}.png`,
                scaledSize: window.google && new window.google.maps.Size(15, 25), // Check for window.google
              }}
              onClick={() => handleMarkerClick(marker)}
              
            >
              {selectedMarker === marker && (
                <InfoWindow onCloseClick={handleCloseInfoWindow}>
                  <div>
                    <strong>{marker.name}</strong><br />
                    Sub-Station ID: {marker.siteId}<br />
                    Longitude: {marker.lng}<br />
                    Vendor: {marker.vendor || 'N/A'}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
