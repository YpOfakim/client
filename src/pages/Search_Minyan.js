// 📁 pages/Search_Minyans.jsx
import React, { useState, useEffect, useRef } from 'react';
import Minyan from '../components/Minyan';
import "../style/minyans.css"; // Assuming you have styles for the minyans
function Search_Minyans() {
  const [minyans, setMinyans] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('');

  const limit = 4;
  const start = useRef(0);
  const containerRef = useRef(null);

  // Get user location once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.error('Location error:', err)
    );
  }, []);

  // Fetch minyans from server
  const fetchMinyans = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/minyans?start=${start.current}&_limit=${limit}`);
      const json = await res.json();

      setMinyans(prev => [...prev, ...json]);
      start.current += limit;

      if (json.length < limit) setHasMore(false);
      if (json.length === 0 && start.current === limit) {
        setMessage('לא נמצאו מניינים');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMessage('שגיאה בטעינת מניינים');
    } finally {
      setLoading(false);
    }
  };

  // Hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Initial load only once
  useEffect(() => {
    fetchMinyans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      if (nearBottom) {
        fetchMinyans();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>מניינים קיימים</h2>
      {message && <div style={{ color: 'red', textAlign: 'center' }}>{message}</div>}
      <div
        ref={containerRef}
        className="minyans-container"
        style={{
          overflowY: 'scroll',
          height: '80vh',
          border: '1px solid #ccc',
          padding: '1em',
        }}
      >
        {minyans.length === 0 && !loading && !message && <p>לא נמצאו מניינים</p>}

        {minyans.map((minyan, index) => (
          <Minyan key={index} minyan={minyan} userLocation={userLocation} />
        ))}

        {loading && <div>טוען מניינים...</div>}
        {!hasMore && <div style={{ textAlign: 'center', marginTop: '1em' }}>אין עוד מניינים</div>}
      </div>
    </div>
  );
}

export default Search_Minyans;
