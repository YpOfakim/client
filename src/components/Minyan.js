import React, { useState, useEffect, useRef } from 'react';
async function getDistanceAndDuration(origin, destination, mode = 'driving') {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  const url = `http://localhost:3001/geocode/distance?origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destinationStr)}&mode=${mode}`;

  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
    const element = data.rows[0].elements[0];
    return {
      distance: element.distance.text,
      duration: element.duration.text,
    };
  } else {
    throw new Error('Failed to calculate distance');
  }
}


function Minyan({ minyan, userLocation }) {
  const [walkInfo, setWalkInfo] = useState(null);
  const [driveInfo, setDriveInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userLocation || !minyan.latitude || !minyan.longitude) return;

    const destination = {
      lat: minyan.latitude,
      lng: minyan.longitude
    };

    getDistanceAndDuration(userLocation, destination, 'walking')
      .then(setWalkInfo)
      .catch(err => setError('שגיאה בחישוב הליכה'));

    getDistanceAndDuration(userLocation, destination, 'driving')
      .then(setDriveInfo)
      .catch(err => setError('שגיאה בחישוב נסיעה'));
  }, [userLocation]);

  return (
    <div className="minyan" style={{ border: '1px solid #ccc', padding: '1em', marginBottom: '1em' }}>
      <h4>🕒 {minyan.time_and_date}</h4>
      <p>📍 כתובת: {minyan.address}</p>
      <p>🌍 מיקום: Lat {minyan.latitude}, Lng {minyan.longitude}</p>

      {walkInfo && (
        <p>🚶‍♂️ הליכה: {walkInfo.duration} ({walkInfo.distance})</p>
      )}
      {driveInfo && (
        <p>🚗 נסיעה: {driveInfo.duration} ({driveInfo.distance})</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Minyan;