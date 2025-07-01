import React, { useState, useEffect, useRef } from 'react';
import Minyan from '../components/Minyan';
import SortOptions from '../components/SortOptions';
import { useParams, Navigate,useNavigate } from 'react-router-dom';
import "../style/minyan-list.css";


function Search_Minyans() {
  const [minyans, setMinyans] = useState([]);
  const [originalMinyans, setOriginalMinyans] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMode, setLocationMode] = useState("current");
  const [manualAddress, setManualAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('');
  const [desiredTime, setDesiredTime] = useState(Date.now());
  const [sortBy, setSortBy] = useState('time');
  const token = localStorage.getItem("token");
const [shouldFetchMinyans, setShouldFetchMinyans] = useState(false);

  const limit = 4;
  const start = useRef(0);
  const containerRef = useRef(null);
const { userId } = useParams(); // מה-URL
const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const navigate = useNavigate();

if (!userInfo.user_id || String(userInfo.user_id) !== userId) {
 navigate('/404'); // אם המשתמש לא מחובר או שה־userId לא תואם, נווט לעמוד 404
}

  useEffect(() => {
    if (userLocation) {
      handleSearch();
    }
  }, [userLocation]);

  // מיון בצד לקוח
  useEffect(() => {
    if (!originalMinyans.length) return;

    let sorted = [...originalMinyans];
    if (sortBy === 'time') {
      sorted.sort((a, b) => new Date(a.time_and_date) - new Date(b.time_and_date));
    } else if (sortBy === 'distance' && userLocation) {
      sorted.sort((a, b) => {
        const distA = Math.hypot(a.latitude - userLocation.lat, a.longitude - userLocation.lng);
        const distB = Math.hypot(b.latitude - userLocation.lat, b.longitude - userLocation.lng);
        return distA - distB;
      });
    }

    setMinyans(sorted);
  }, [sortBy, userLocation, originalMinyans]);

  // קבלת מיקום נוכחי
  useEffect(() => {
    if (locationMode === "current") {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.error('Location error:', err)
      );
    }
  }, [locationMode]);

  // חיפוש כללי
const handleSearch = async () => {
  setMinyans([]);
  setOriginalMinyans([]);
  setHasMore(true);
  start.current = 0;

  if (locationMode === "manual") {
    const ok = await fetchCoordsFromAddress(manualAddress);
    if (!ok) return;
    setShouldFetchMinyans(true); // תאפשר את הקריאה כשהכתובת הוזנה בהצלחה
  } else {
    setShouldFetchMinyans(true); // מיקום נוכחי
  }
};
useEffect(() => {
  if (shouldFetchMinyans && userLocation) {
    fetchMinyans();
    setShouldFetchMinyans(false); // לנקות כדי למנוע קריאות חוזרות
  }
}, [shouldFetchMinyans, userLocation]);


  // המרת כתובת לקורדינטות
  const fetchCoordsFromAddress = async (address) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw`);
      const data = await res.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setUserLocation({ lat: location.lat, lng: location.lng });
        return true;
      } else {
        setMessage("כתובת לא תקינה");
        return false;
      }
    } catch (err) {
      setMessage("שגיאה באימות כתובת");
      return false;
    }
  };

  // שליפת מניינים מהשרת
const fetchMinyans = async () => {
  if (loading || !hasMore) return;
  setLoading(true);

  try {
    const url = new URL("http://localhost:3001/minyans");
    url.searchParams.set("start", start.current);
    url.searchParams.set("_limit", limit);

    const timeToUse = desiredTime && !isNaN(new Date(desiredTime)) ? new Date(desiredTime) : new Date();
    url.searchParams.set("time_from", timeToUse.toISOString());

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const json = await res.json();

    if (json.length === 0 && start.current === 0) {
      setMessage("לא נמצאו מניינים");
    }

    const newIds = new Set(json.map(m => m.id));
    const filtered = originalMinyans.filter(m => !newIds.has(m.id));
    const newCombined = [...filtered, ...json];

    setOriginalMinyans(newCombined);
    start.current += limit;

    if (json.length < limit) {
      setHasMore(false);
    }

  } catch (err) {
    console.error('Fetch error:', err);
    setMessage("שגיאה בטעינת מניינים");
  } finally {
    setLoading(false);
  }
};



  // אינפיניט סקרול
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      if (nearBottom) fetchMinyans();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // נקה הודעה לאחר כמה שניות
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // תאריך נוכחי בפורמט ל־datetime-local
  const getNowDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

return (
  <div className="minyan-list-page">
    <div className="minyan-list-container">
      <h2>מניינים קיימים</h2>

      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
        <label>מניין לזמן מסוים:</label>
        <input
          type="datetime-local"
          value={desiredTime || ''}
          min={getNowDateTimeLocal()}
          onChange={(e) => setDesiredTime(e.target.value)}
        />
      </div>

      <SortOptions sortBy={sortBy} setSortBy={setSortBy} />

      <div style={{ textAlign: 'center', marginBottom: '1em' }}>
        <label>
          <input
            type="radio"
            name="locationMode"
            value="current"
            checked={locationMode === "current"}
            onChange={() => setLocationMode("current")}
          />
          המיקום הנוכחי שלי
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            name="locationMode"
            value="manual"
            checked={locationMode === "manual"}
            onChange={() => setLocationMode("manual")}
          />
          כתובת אחרת
        </label>

{locationMode === "manual" && (
  <div style={{ marginTop: '0.5em' }}>
    <input
      type="text"
      placeholder="לדוגמה: הרצל 10, תל אביב"
      value={manualAddress}
      onChange={(e) => setManualAddress(e.target.value)}
    />
  </div>
)}

<div style={{ marginTop: '1em' }}>
  <button onClick={handleSearch}>🔍 חפש</button>
</div>
      </div>

      {message && <div className="message">{message}</div>}

      <div ref={containerRef} className="minyans-container">
        {minyans.length === 0 && !loading && !message && <p>לא נמצאו מניינים</p>}

        {minyans.map((minyan, index) => (
          <Minyan
            key={index}
            minyan={minyan}
            userLocation={userLocation}
            departureTime={desiredTime || new Date().toISOString()}
          />
        ))}

        {loading && <div>טוען מניינים...</div>}
        {!hasMore && <div style={{ textAlign: 'center', marginTop: '1em' }}>אין עוד מניינים</div>}
      </div>
    </div>
  </div>
);}

export default Search_Minyans;
