import React, { useEffect, useState } from 'react';
import Daily_Segment from '../components/Daily_Segment';

function Daily_Segments_History() {
  const [segments, setSegments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/daily_segments/all-daily-pages')
      .then(res => res.json())
      .then(data => {
        // מנרמל את התאריכים ומונע כפילויות
        const uniqueByDate = {};
        data.forEach(s => {
          const dateOnly = new Date(s.segment_date).toISOString().slice(0, 10);
          if (!uniqueByDate[dateOnly]) {
            uniqueByDate[dateOnly] = { ...s, dateOnly };
          }
        });

        // הופך למערך וממיין
        const sorted = Object.values(uniqueByDate).sort((a, b) => new Date(b.dateOnly) - new Date(a.dateOnly));
        setSegments(sorted);

        // קובע ברירת מחדל של היום אם קיים
        const today = new Date().toISOString().slice(0, 10);
        const todayExists = sorted.find(s => s.dateOnly === today);
        setSelectedDate(todayExists ? today : sorted[0]?.dateOnly);
      });
  }, []);

  return (
    <div style={{ display: 'flex', direction: 'rtl', height: '100%' }}>
      <div style={{ width: '30%', overflowY: 'auto', borderLeft: '1px solid lightgray', padding: '1rem' }}>
        <h3>היסטוריית חיזוקים</h3>
        {segments.map(segment => (
          <div
            key={segment.dateOnly}
            onClick={() => {
              console.log("נבחר תאריך:", segment.dateOnly);
              setSelectedDate(segment.dateOnly);
            }}
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
        ))}
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
