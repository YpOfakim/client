import React, { useEffect, useState } from 'react';
import Daily_Segment from '../components/Daily_Segment'; 

function Daily_Segments_History() {
  const [segments, setSegments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // שליפת כל החיזוקים (בהנחה שהשרת מחזיר רשימה של אובייקטים עם תאריך ונתיב PDF)
    fetch('/api/daily_segments') // החליפי לכתובת האמיתית שלך
      .then(res => res.json())
      .then(data => {
        // מיון מהתאריך החדש לישן
        const sorted = data.sort((a, b) => new Date(b.segment_date) - new Date(a.segment_date));
        setSegments(sorted);

        // ברירת מחדל: תאריך של היום
        const today = new Date().toISOString().slice(0, 10);
        const todayExists = sorted.find(s => s.segment_date === today);
        setSelectedDate(todayExists ? today : sorted[0]?.segment_date);
      });
  }, []);

  return (
    <div style={{ display: 'flex', direction: 'rtl', height: '100%' }}>
      {/* רשימת תאריכים - צד ימין */}
      <div style={{ width: '30%', overflowY: 'auto', borderLeft: '1px solid lightgray', padding: '1rem' }}>
        <h3>היסטוריית חיזוקים</h3>
        {segments.map(segment => (
          <div
            key={segment.segment_date}
            onClick={() => setSelectedDate(segment.segment_date)}
            style={{
              padding: '0.5rem',
              marginBottom: '0.5rem',
              cursor: 'pointer',
              backgroundColor: selectedDate === segment.segment_date ? '#d1e7dd' : 'transparent',
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            {new Date(segment.segment_date).toLocaleDateString('he-IL')}
          </div>
        ))}
      </div>

      {/* תצוגת חיזוק יומי - צד שמאל */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {selectedDate && (
          <Daily_Segment selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
}

export default Daily_Segments_History;
