import React from 'react';
// import {GoogleMap, Marker, useLoadScript} from '@react-google-maps/api';
// import { Card, CardContent, Typography } from '@mui/material';
// import marker from '../assets/images/marker/greenMarker3232.png'

// const libraries = ['places'];
// const MapWithMarker = ({ locationName, latitude, longitude, vendorName, batteryAHCapacity }) => {
//   const [isInfoWindowOpen, setIsInfoWindowOpen] = React.useState(false);
//   const defaultZoom = 10;
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4',
//     libraries,
//   });

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }
//   const mapContainerStyle = {
//     width: "100%",
//     height:"200px"
//   };

//   const center = {
//     lat: latitude,  // Default latitude (San Francisco)
//     lng: longitude,  // Default longitude (San Francisco)
//   };
//   const markerPosition = {
//     lat: latitude,  // Default latitude (San Francisco)
//     lng: longitude,  // Default longitude (San Francisco)
//   };
//   if (!isLoaded) return <p>Loading map...</p>;
//   const customMarker = {
//     url: {marker} || 'default_marker_image_url', // Replace with your custom image URL
//     size: new google.maps.Size(100, 100), // Customize the size of the marker image
//     origin: new google.maps.Point(0, 0),  // The origin of the image
//     anchor: new google.maps.Point(20, 40), // The anchor point of the marker (where it clicks)
//   };
//   return (
//     <div style={{ marginTop: "20px" }}>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={defaultZoom}
//       >
//         <Marker
//           position={markerPosition}
//           title={locationName || "Location"}
//           label={vendorName || ""}
//           icon={customMarker}
//         />
//       </GoogleMap>
//     </div>
//   );
// };
import React from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const MapWithMarker = ({ locationName, latitude, longitude, vendorName, batteryAHCapacity }) => {
  const [selectedMarker, setSelectedMarker] = React.useState(false);

  const handleMarkerClick = () => {
    setSelectedMarker(true);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(false);
  };

  const mapStyles = {
    height: "200px",
    width: "100%",
  };

  const defaultCenter = {
    lat: parseFloat(latitude) || 17.4065,
    lng: parseFloat(longitude) || 78.4772,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDRsvO4B8wU4AtMjhgRkjRx0YVdrfwouN4">
      <GoogleMap center={defaultCenter} zoom={5} mapContainerStyle={mapStyles}>
        {window.google && (
          <Marker
            position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
            icon={{
              url: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-green.png`,
              scaledSize: new window.google.maps.Size(15, 25), // Customize size
            }}
            onClick={handleMarkerClick}
          />
        )}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div>
              <strong>{locationName || "Location"}</strong>
              <br />
              Vendor: {vendorName || "N/A"}
              <br />
              Battery Capacity: {batteryAHCapacity || "N/A"} AH
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithMarker;
