// RouteMap.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};
const LIBRARIES = ['places'];
function RouteMap({ origin, destination, travelMode }) {
  console.log(origin, destination)
  const [directions, setDirections] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw', // החלף למפתח שלך
    libraries:  LIBRARIES
  });

  useEffect(() => {
    if (!isLoaded) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode[travelMode],
      },
      (result, status) => {
          console.log('Directions response:', status, result);
        if (status === 'OK') {
          setDirections(result);
        } else {
              console.error('Directions request failed:', status);
          setDirections(null);
        }
      }
    );
  }, [isLoaded, origin, destination, travelMode]);

  if (!isLoaded) return <div>טוען מפה...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={13}>
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default RouteMap;
