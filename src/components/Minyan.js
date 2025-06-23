import React, { useState, useEffect } from 'react';

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
      durationValue: element.duration.value, // בשניות
    };
  } else {
    throw new Error('Failed to calculate distance');
  }
}

function formatDateTime(datetimeStr) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Date(datetimeStr).toLocaleString('he-IL', options);
}

function Minyan({ minyan, userLocation, departureTime }) {
  const [walkInfo, setWalkInfo] = useState(null);
  const [driveInfo, setDriveInfo] = useState(null);
  const [error, setError] = useState('');
  const [missesWalk, setMissesWalk] = useState(false);
  const [missesDrive, setMissesDrive] = useState(false);

  useEffect(() => {
    if (!userLocation || !minyan.latitude || !minyan.longitude || !departureTime) return;

    const destination = {
      lat: minyan.latitude,
      lng: minyan.longitude
    };

    const minyanTime = new Date(minyan.time_and_date).getTime();
    const departure = new Date(departureTime).getTime();

    getDistanceAndDuration(userLocation, destination, 'walking')
      .then(info => {
        setWalkInfo(info);
        const arrivalTime = departure + info.durationValue * 1000;
        setMissesWalk(arrivalTime > minyanTime);
      })
      .catch(() => setError('שגיאה בחישוב הליכה'));

    getDistanceAndDuration(userLocation, destination, 'driving')
      .then(info => {
        setDriveInfo(info);
        const arrivalTime = departure + info.durationValue * 1000;
        setMissesDrive(arrivalTime > minyanTime);
      })
      .catch(() => setError('שגיאה בחישוב נסיעה'));
  }, [userLocation, departureTime]);


  const fullyMissed = missesWalk && missesDrive;

  return (
    <div
      className="minyan"
      style={{
        border: '1px solid #ccc',
        padding: '1em',
        marginBottom: '1em',
        backgroundColor: fullyMissed ? '#e0e0e0' : 'white',
        opacity: fullyMissed ? 0.6 : 1,
        pointerEvents: fullyMissed ? 'none' : 'auto'
      }}
    >
      <h4>🕒 {formatDateTime(minyan.time_and_date)}</h4>
      <p>📍 כתובת: {minyan.address}</p>
      <p>🌍 מיקום: Lat {minyan.latitude}, Lng {minyan.longitude}</p>

      {walkInfo && (
        <p style={{ color: missesWalk ? 'gray' : 'black' }}>
          🚶‍♂️ הליכה: {walkInfo.duration} ({walkInfo.distance})
        </p>
      )}
      {driveInfo && (
        <p>
          🚗 נסיעה: {driveInfo.duration} ({driveInfo.distance})
        </p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Minyan;
