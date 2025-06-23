import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Prayer() {
  const { prayerName } = useParams();
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  async function fetchImages() {
    setImageUrls([]); // 🧹 איפוס קודם

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


  if (error) return <div>שגיאה: {error}</div>;
  if (imageUrls.length === 0) return <div>טוען תמונות...</div>;

  return (
    <div dir="rtl" style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>{prayerName}</h2>
      <hr />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={`http://localhost:3001${url}`}
            alt={`עמוד ${index + 1}`}
            style={{
                maxWidth: '700px',     // 👈 זה הגבול המקסימלי של רוחב התמונה
                width: '90%',          // 👈 זה כמה רוחב מתוך המסך היא תתפוס (עד ה־maxWidth)
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
           }}

          />
        ))}
      </div>
    </div>
  );
}
