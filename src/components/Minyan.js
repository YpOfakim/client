import React, { useState, useEffect } from 'react';
import RouteMap from './RouteMap';

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
      durationValue: element.duration.value,
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
  const [joinCount, setJoinCount] = useState(null);
  const [isJoined, setIsJoined] = useState();
  const [showMap, setShowMap] = useState(false);
  const [travelMode, setTravelMode] = useState('driving');
const token = localStorage.getItem("token");

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const user_id = userInfo.user_id;

useEffect(() => {
  let isMounted = true;

  fetch(`http://localhost:3001/prayersInMinyan?user_id=${user_id}&minyan_id=${minyan.minyan_id}`)
    .then(res => {
      if (!res.ok) throw new Error('שגיאה בבדיקת הצטרפות');
      return res.json();
    })
    .then(data => {
      if (!isMounted) return;
      // ודאי שההשוואה בין מספרים
      if (Array.isArray(data) && data.some(item => Number(item.user_id) === Number(user_id))) {
        setIsJoined(true);
      } else {
        setIsJoined(false);
      }
    })
    .catch(() => {
      if (isMounted) setIsJoined(false);
    });

  fetch(`http://localhost:3001/prayersInMinyan/count/${minyan.minyan_id}`)
    .then(res => {
      if (!res.ok) throw new Error('שגיאה בספירת מצטרפים');
      return res.json();
    })
    .then(data => {
      if (isMounted && typeof data.count === 'number') setJoinCount(data.count);
      else if (isMounted) setJoinCount(null);
    })
    .catch(() => {
      if (isMounted) setJoinCount(null);
    });

  return () => { isMounted = false; };
}, [minyan.minyan_id, user_id]);

useEffect(() => {
  if (!userLocation || !minyan.latitude || !minyan.longitude || !departureTime) return;

  const destination = { lat: minyan.latitude, lng: minyan.longitude };
  const minyanTime = new Date(minyan.time_and_date).getTime();
  const departure = new Date(departureTime).getTime();

  // חישוב זמן הליכה
  getDistanceAndDuration(userLocation, destination, 'walking')
    .then(info => {
      setWalkInfo(info);
      const arrivalTime = departure + info.durationValue * 1000;
      setMissesWalk(arrivalTime > minyanTime);
    })
    .catch(() => setError('שגיאה בחישוב הליכה'));

  // חישוב זמן נסיעה
  getDistanceAndDuration(userLocation, destination, 'driving')
    .then(info => {
      setDriveInfo(info);
      const arrivalTime = departure + info.durationValue * 1000;
      setMissesDrive(arrivalTime > minyanTime);
    })
    .catch(() => setError('שגיאה בחישוב נסיעה'));
}, [userLocation, departureTime, minyan.latitude, minyan.longitude, minyan.time_and_date]);

  const handleCancelJoin = () => {
    fetch('http://localhost:3001/prayersInMinyan', {
      method: 'DELETE',
     headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
      body: JSON.stringify({ user_id, minyan_id: minyan.minyan_id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setIsJoined(false);
        else setError('שגיאה בביטול הצטרפות');
      })
      .catch(() => setError('שגיאה בביטול הצטרפות'));
      setJoinCount(prev => (isJoined ? prev - 1 : prev + 1));

  };

  const handleAddToMinyan = async () => {
    if (!user_id || !minyan.minyan_id) {
      setError('משתמש או מניין לא תקינים');
      return;
    }
    try {
      const data = { minyan_id: minyan.minyan_id, user_id };
      const res = await fetch('http://localhost:3001/prayersInMinyan', {
        method: 'POST',
      headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(`שגיאה בשרת: ${errText}`);
        return;
      }

      const result = await res.json();
      if (result && (result.success || result.id)) {
        setIsJoined(true);
        setJoinCount(prev => (isJoined ? prev - 1 : (prev !== null ? prev + 1 : 1)));
        setError('');
      } else {
        setError('שגיאה בהצטרפות למניין');
      }
    } catch (err) {
      setError('שגיאה בהצטרפות למניין: ' + (err.message || err));
    }
  };

  const fetchRoute = async (origin, destination) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=YOUR_API_KEY`
    );
    const data = await res.json();
    return data;
  };

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
        pointerEvents: fullyMissed ? 'none' : 'auto',
      }}
    >
      <h4>🕒 {formatDateTime(minyan.time_and_date)}</h4>
      <p>מנהל המניין:</p>
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
      {joinCount !== null && <p>🧍‍♂️ מספר מצטרפים: {joinCount}</p>}
      <p style={{ color: isJoined ? 'green' : 'red' }}>
        {isJoined ? '✅ אתה מצטרף למניין זה' : '❌ אתה לא מצטרף למניין זה'}
      </p>
      {fullyMissed ? (
        <p style={{ color: 'red' }}>❗️ פספסת את המניין הזה</p>
      ) : (
        <p>⏰ יש לך זמן להצטרף למניין הזה</p>
      )}

      <div style={{ marginTop: '0.5em' }}>
        <label>
          <input
            type="radio"
            value="driving"
            checked={travelMode === 'driving'}
            onChange={() => setTravelMode('driving')}
          />
          נסיעה
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            value="walking"
            checked={travelMode === 'walking'}
            onChange={() => setTravelMode('walking')}
          />
          הליכה
        </label>
      </div>

      {isJoined ? (
        <button onClick={handleCancelJoin}>בטל הצטרפות</button>
      ) : (
        <button onClick={handleAddToMinyan}>הצטרף למניין</button>
      )}

      <button onClick={() => setShowMap(prev => !prev)}>
        {showMap ? 'הסתר מפה' : 'צפה במסלול'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

  {showMap && userLocation && (
  <RouteMap
    origin={{ lat: userLocation.lat, lng: userLocation.lng }}
    destination={{ lat: minyan.latitude, lng: minyan.longitude }}
    travelMode={travelMode.toUpperCase()} // 'DRIVING' או 'WALKING'
  />
)}

    </div>
  );
}

export default Minyan;
