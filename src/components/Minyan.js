// Minyan.js
import React, { useState, useEffect } from 'react';
import RouteMap from './RouteMap';

import { getDistanceAndDuration,formatDateTime } from '../helpers/helpers';




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
 const [openerInfo, setOpenerInfo] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const user_id = userInfo.user_id;

  useEffect(() => {
    let isMounted = true;

    fetch(`http://localhost:3001/prayersInMinyan?user_id=${user_id}&minyan_id=${minyan.minyan_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בבדיקת הצטרפות');
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.some(item => Number(item.user_id) === Number(user_id))) {
          setIsJoined(true);
        } else {
          setIsJoined(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsJoined(false);
      });

    fetch(`http://localhost:3001/prayersInMinyan/count/${minyan.minyan_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
  // שליפת פרטי מנהל המניין לפי opener_id
useEffect(() => {
  let isMounted = true;
  const token = localStorage.getItem("token");

  if (minyan.opener_id && token) {
    fetch(`http://localhost:3001/users/${minyan.opener_id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בשליפת פרטי מנהל המניין');
        return res.json();
      })
      .then(data => {
        if (isMounted) setOpenerInfo(data);
      })
      .catch(() => {
        if (isMounted) setOpenerInfo(null);
      });
  }

  return () => {
    isMounted = false;
  };
}, [minyan.opener_id]);


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

console.log("תשובת שרת:", result);
if (result && result.prayersInMinyan_id) {
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

  const fullyMissed = missesWalk && missesDrive;

  return (
       <div className={`minyan ${fullyMissed ? 'fully-missed' : ''}`}>
          <h4>🕒 {formatDateTime(minyan.time_and_date)}</h4>
            <p>
        מנהל המניין:{" "}
        {openerInfo
          ? <>
              {openerInfo.userName || openerInfo.user_name || ''}{" "}
              {openerInfo.phone && <>| 📞 {openerInfo.phone}</>}
            </>
          : "טוען..."}
      </p>
      <p>📍 כתובת: {minyan.address}</p>
      <p>🌍 מיקום: Lat {minyan.latitude}, Lng {minyan.longitude}</p>

      {walkInfo && <p style={{ color: missesWalk ? 'gray' : 'black' }}>🚶‍♂️ הליכה: {walkInfo.duration} ({walkInfo.distance})</p>}
      {driveInfo && <p>🚗 נסיעה: {driveInfo.duration} ({driveInfo.distance})</p>}
      {joinCount !== null && <p>🧍‍♂️ מספר מצטרפים: {joinCount}</p>}
      <p style={{ color: isJoined ? 'green' : 'red' }}>{isJoined ? '✅ אתה מצטרף למניין זה' : '❌ אתה לא מצטרף למניין זה'}</p>
      {fullyMissed ? <p style={{ color: 'red' }}>❗️ פספסת את המניין הזה</p> : <p>⏰ יש לך זמן להצטרף למניין הזה</p>}

      <div style={{ marginTop: '0.5em' }}>
        <label>
          <input type="radio" value="driving" checked={travelMode === 'driving'} onChange={() => setTravelMode('driving')} /> נסיעה
        </label>
        &nbsp;&nbsp;
        <label>
          <input type="radio" value="walking" checked={travelMode === 'walking'} onChange={() => setTravelMode('walking')} /> הליכה
        </label>
      </div>
{!isJoined && user_id !== minyan.opener_id && (
  <button onClick={handleAddToMinyan}>הצטרפות</button>
)}
{isJoined && user_id !== minyan.opener_id && (
  <button onClick={handleCancelJoin}>בטל הצטרפות</button>
)}
      <button onClick={() => setShowMap(prev => !prev)}>{showMap ? 'הסתר מפה' : 'צפה במסלול'}</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showMap && userLocation && (
        <RouteMap origin={{ lat: userLocation.lat, lng: userLocation.lng }} destination={{ lat: minyan.latitude, lng: minyan.longitude }} travelMode={travelMode.toUpperCase()} />
      )}
    </div>
  );
}

export default Minyan;
