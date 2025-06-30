import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import '../style/create-minyan.css';
const GOOGLE_API_KEY = 'AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw';

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err)
    );
  });
}

async function getLatLngFromAddress(address) {
  const res = await fetch(`http://localhost:3001/geocode/geocode?address=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data.status === 'OK') {
    return data.results[0].geometry.location;
  } else {
    throw new Error('Address not found');
  }
}

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

function Create_Minyan() {
  const { userId } = useParams();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [mode, setMode] = useState('walking');
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [time, setTime] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [calcType, setCalcType] = useState('from-location');
const token = localStorage.getItem("token");


  useEffect(() => {
    if (calcType === 'from-location') {
      getUserLocation()
        .then(setLocation)
        .catch(() => setError('לא ניתן לקבל מיקום'));
    }
  }, [calcType]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRouteInfo(null);
    try {
      const origin = calcType === 'from-location' ? location : await getLatLngFromAddress(from);
      const destination = await getLatLngFromAddress(calcType === 'from-location' ? address : to);
      const info = await getDistanceAndDuration(origin, destination, mode);
      setRouteInfo(info);
    } catch (err) {
      setError(err.message);
    }
  };

const handleCreateMinyan = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!time) {
    setError('נא להזין תאריך ושעה');
    return;
  }

const data = {
  time,
  opener_id: userId

};


  try {
    if (useCurrentLocation) {
      if (!location) {
        setError('נא לקבל מיקום');
        return;
      }
      data.location = location;  // שולח מיקום
      data.address = null;
    } else {
      if (!address) {
        setError('נא להזין כתובת');
        return;
      }
      data.address = address;  // שולח כתובת
      data.location = null;
    }
console.log("Token from localStorage:", token);
console.log("Data:", data);

    const res = await fetch('http://localhost:3001/minyans', {
      method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess('מניין נוצר בהצלחה!');
      setTime('');
      setAddress('');
      setLocation(null);
    } else {
      const errData = await res.json();
      setError(errData.error || 'שגיאה ביצירת מניין');
    }
  } catch (err) {
    console.error(err);
    setError('שגיאת שרת');
    
  }
  
};

  const getNowDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };
  return (
    
      /*{ <h3>משתמש: {userId}</h3>
      <div>
        <label>
          <input
            type="radio"
            value="from-location"
            checked={calcType === 'from-location'}
            onChange={() => setCalcType('from-location')}
          /> חישוב מהמיקום שלי
        </label>
        <label>
          <input
            type="radio"
            value="between-addresses"
            checked={calcType === 'between-addresses'}
            onChange={() => setCalcType('between-addresses')}
          /> חישוב בין כתובות
        </label> }*/
      // {/* </div> */}

      /* {<form onSubmit={handleAddressSubmit}>
        {calcType === 'from-location' ? (
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="הכנס כתובת יעד"
          />
        ) : (
          <>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="כתובת מוצא"
            />
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="כתובת יעד"
              style={{ marginLeft: '0.5em' }}
            />
          </>
        )}
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: '0.5em' }}>
          <option value="walking">הליכה</option>
          <option value="driving">רכב</option>
        </select>
        <button type="submit">חשב מרחק</button>
      </form>

      {routeInfo && (
        <div>
          <p>מרחק: {routeInfo.distance}</p>
          <p>זמן: {routeInfo.duration}</p>
        </div>
      )}

      <hr />} */
       <div className="create-minyan-page">
    <form className="create-minyan-form" onSubmit={handleCreateMinyan}>
      <h2>צור מניין</h2>

      <div>
        <label>תאריך ושעה:</label>
        <input
          type="datetime-local"
          min={getNowDateTimeLocal()}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label>
          <input
            type="radio"
            checked={useCurrentLocation}
            onChange={() => setUseCurrentLocation(true)}
          />
          השתמש במיקום הנוכחי
        </label>
        <button
          type="button"
          onClick={() => getUserLocation().then(setLocation)}
          disabled={!useCurrentLocation}
        >
          קבל מיקום
        </button>
        {location && useCurrentLocation && (
          <span>(Lat: {location.lat}, Lng: {location.lng})</span>
        )}
      </div>

      <div>
        <label>
          <input
            type="radio"
            checked={!useCurrentLocation}
            onChange={() => setUseCurrentLocation(false)}
          />
          הזן כתובת
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={useCurrentLocation}
          placeholder="כתובת"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit">צור מניין</button>
    </form>

    <Outlet />
  </div>
);
}

export default Create_Minyan;