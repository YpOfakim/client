import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Prayer() {
  const { prayerName } = useParams();
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchText() {
      try {
        const res = await fetch(`http://localhost:3001/prayers/text/${encodeURIComponent(prayerName)}`);
        if (!res.ok) throw new Error('לא נמצאה תפילה');
        const data = await res.text(); // קיבלנו טקסט גולמי
        setText(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchText();
  }, [prayerName]);

  if (error) return <div>שגיאה: {error}</div>;
  if (!text) return <div>טוען תפילה...</div>;

  return (
    <div dir="rtl" style={{ whiteSpace: 'pre-wrap', padding: '1rem' }}>
      <h2>{prayerName}</h2>
      <hr />
      <div>{text}</div>
    </div>
  );
}
