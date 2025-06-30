import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Prayer() {
  const { prayerName } = useParams();
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setImageUrls([]);
      setError(null);

      try {
        const res = await fetch(`http://localhost:3001/prayers/images/${encodeURIComponent(prayerName)}`);
        if (!res.ok) throw new Error('תמונות לא נמצאו');
        const data = await res.json();
        setImageUrls(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchImages();
  }, [prayerName]);

  if (error) return <div style={{color: 'red', textAlign: 'center', marginTop: '2rem'}}>שגיאה: {error}</div>;
  if (imageUrls.length === 0) return <div style={{textAlign: 'center', marginTop: '2rem'}}>טוען תמונות...</div>;

  return (
    <div dir="rtl" style={{ backgroundColor: '#f5f0e6', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#4b3b2b', marginBottom: '2rem' }}>
        תפילה: {prayerName}
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={`http://localhost:3001${url}`}
            alt={`עמוד ${index + 1}`}
            style={{
              maxWidth: '700px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              backgroundColor: '#fffdf8',
              padding: '0.5rem',
            }}
          />
        ))}
      </div>
    </div>
  );
}
