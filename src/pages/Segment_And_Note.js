import React, { useEffect, useState } from 'react';

function Segment_And_Note() {
  const [segment, setSegment] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the daily segment from the server
  useEffect(() => {
    async function fetchSegment() {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/daily-segment');
        const data = await response.json();
        setSegment(data);
        // Load note from localStorage if exists
        const savedNote = localStorage.getItem(`note_${data.id}`);
        setNote(savedNote || '');
      } catch (err) {
        setSegment({ text: 'Failed to load segment.' });
      }
      setLoading(false);
    }
    fetchSegment();
  }, []);

  // צקיך לשמור פתק נורמלי
//   const handleSaveNote = () => {
//     if (segment && segment.id) {
//       localStorage.setItem(`note_${segment.id}`, note);
//       alert('Note saved!');
//     }
//   };

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
        <h3>Daily Segment</h3>
        {loading ? <p>Loading...</p> : <p>{segment?.text}</p>}
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
        <h3>Your Note</h3>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={10}
          style={{ width: '100%' }}
          placeholder="Write your note here..."
        />
        <br />
        <button onClick={handleSaveNote}>Save Note</button>
      </div>
    </div>
  );
}

export default Segment_And_Note;