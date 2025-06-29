import React, { useEffect, useState } from 'react';
import Daily_Segment from '../components/Daily_Segment';

function Daily_Segments_History() {
  const [segments, setSegments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  function getLocalDateOnly(dateStr = '') {
    if (!dateStr) return '';
    const [datePart] = dateStr.split(',');
    const [day, month, year] = datePart.trim().split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  useEffect(() => {
    fetch('http://localhost:3001/daily_segments/all-daily-pages')
      .then(res => res.json())
      .then(data => {
        const uniqueByDate = {};
        data.forEach(s => {
          const dateOnly = getLocalDateOnly(s.segment_date);
          if (!uniqueByDate[dateOnly]) {
            uniqueByDate[dateOnly] = { ...s, dateOnly };
          }
        });

        const sorted = Object.values(uniqueByDate).sort((a, b) => new Date(b.dateOnly) - new Date(a.dateOnly));
        setSegments(sorted);

        const today = getLocalDateOnly();
        const todayExists = sorted.find(s => s.dateOnly === today);
        setSelectedDate(todayExists ? today : sorted[0]?.dateOnly || null);
      })
      .catch(err => {
        console.error("שגיאה בטעינת הנתונים:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', direction: 'rtl', height: '100%' }}>
      <div style={{ width: '30%', overflowY: 'auto', borderLeft: '1px solid lightgray', padding: '1rem' }}>
        <h3>היסטוריית חיזוקים</h3>
        {loading ? (
          <p>טוען חיזוקים...</p>
        ) : segments.length === 0 ? (
          <p>לא נמצאו חיזוקים</p>
        ) : (
          segments.map(segment => (
            <div
              key={segment.dateOnly}
              onClick={() => setSelectedDate(segment.dateOnly)}
              style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                backgroundColor: selectedDate === segment.dateOnly ? '#d1e7dd' : 'transparent',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              {new Date(segment.dateOnly).toLocaleDateString('he-IL')}
            </div>
          ))
        )}
      </div>

      <div style={{ flex: 1, padding: '1rem' }}>
        {selectedDate && (
          <Daily_Segment selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
}

export default Daily_Segments_History;
