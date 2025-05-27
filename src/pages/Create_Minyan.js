// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// function Create_Minyan() {
//   const { userId } = useParams(); 



// //   return (
// //    <>
// //    <h3>user {userId}</h3>
// //    <div>
// //    </div>
// //    <Outlet/>
// //    </>
// //   );
// }

// export default Create_Minyan;
import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

// קבל מיקום משתמש
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation not available"));
    }
  });
}

// קבל קואורדינטות מכתובת (OpenStreetMap)
async function getLatLngFromAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log('Nominatim response:', data); // הוסיפי שורה זו

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } else {
    throw new Error("Address not found");
  }
}

// חישוב מרחק וזמן (OpenRouteService)
async function getDistanceAndDuration(origin, destination, mode = "foot-walking") {
  const apiKey = "YOUR_OPENROUTESERVICE_API_KEY"; // הכניסי כאן את המפתח שלך
  const url = `https://api.openrouteservice.org/v2/directions/${mode}?api_key=${apiKey}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data && data.features && data.features.length > 0) {
    const summary = data.features[0].properties.summary;
    return {
      distance: (summary.distance / 1000).toFixed(2) + " ק\"מ",
      duration: Math.round(summary.duration / 60) + " דקות"
    };
  } else {
    throw new Error("Could not calculate route");
  }
}

function Create_Minyan() {
  const { userId } = useParams();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [addressFrom, setAddressFrom] = useState('');
  const [addressTo, setAddressTo] = useState('');
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('foot-walking');
  const [calcType, setCalcType] = useState('from-location'); // 'from-location' or 'between-addresses'

  useEffect(() => {
    if (calcType === 'from-location') {
      getUserLocation()
        .then(setLocation)
        .catch((error) => {
          setError("לא ניתן לקבל מיקום משתמש");
          console.error(error);
        });
    }
  }, [calcType]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRouteInfo(null);
    try {
      let origin, dest;
      if (calcType === 'from-location') {
        if (!location) {
          setError("מיקום משתמש לא ידוע");
          return;
        }
        origin = location;
        dest = await getLatLngFromAddress(address);
      } else {
        origin = await getLatLngFromAddress(addressFrom);
        dest = await getLatLngFromAddress(addressTo);
      }
      setDestination(dest);
      const info = await getDistanceAndDuration(origin, dest, mode);
      setRouteInfo(info);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h3>user {userId}</h3>
      <div>
        <label>
          <input
            type="radio"
            value="from-location"
            checked={calcType === 'from-location'}
            onChange={() => setCalcType('from-location')}
          />
          חישוב מהמיקום שלי
        </label>
        <label style={{marginRight: '1em'}}>
          <input
            type="radio"
            value="between-addresses"
            checked={calcType === 'between-addresses'}
            onChange={() => setCalcType('between-addresses')}
          />
          חישוב בין שתי כתובות
        </label>
      </div>
      {calcType === 'from-location' && (
        <div>
          {location
            ? <p>המיקום שלך: Latitude: {location.lat}, Longitude: {location.lng}</p>
            : <p>בודק מיקום...</p>}
        </div>
      )}
      <form onSubmit={handleAddressSubmit}>
        {calcType === 'from-location' ? (
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="הכנס כתובת יעד"
          />
        ) : (
          <>
            <input
              type="text"
              value={addressFrom}
              onChange={e => setAddressFrom(e.target.value)}
              placeholder="כתובת מוצא"
              style={{marginLeft: '0.5em'}}
            />
            <input
              type="text"
              value={addressTo}
              onChange={e => setAddressTo(e.target.value)}
              placeholder="כתובת יעד"
              style={{marginLeft: '0.5em'}}
            />
          </>
        )}
        <select value={mode} onChange={e => setMode(e.target.value)} style={{marginLeft: '0.5em'}}>
          <option value="foot-walking">הליכה</option>
          <option value="driving-car">נסיעה ברכב</option>
        </select>
        <button type="submit" style={{marginLeft: '0.5em'}}>חשב מרחק</button>
      </form>
      {routeInfo && (
        <div>
          <p>מרחק: {routeInfo.distance}</p>
          <p>זמן {mode === "foot-walking" ? "הליכה" : "נסיעה"}: {routeInfo.duration}</p>
        </div>
      )}
      {error && <div style={{color: 'red'}}>{error}</div>}
      <Outlet />
    </>
  );
}

export default Create_Minyan;