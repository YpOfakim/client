import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Daily_Segment from '../components/Daily_Segment'; 
import '../style/Style_segment_note.css';

function Segment_And_Note() {
  const { userId } = useParams();  // קבלת ה-userId מה-URL
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");



  const handleSaveNote = async () => {
    try {
      const res = await fetch(`http://localhost:3001/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          note: note,
          title: title,
          userId: userId
        })
      });

      if (!res.ok) throw new Error("שגיאה בשמירת ההערה");
      alert("ההערה נשמרה!");
    } catch (err) {
      alert("אירעה שגיאה בשמירה");
      console.error(err);
    }
  };

  if (loading) return <p>טוען...</p>;

  return (
    <div className="segment-container">
      <div className="segment-image">
        <Daily_Segment selectedDate={today} />
      </div>

      <div className="segment-note">
        <h3>הערה אישית</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="כותרת ההערה"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="כתוב/י כאן הערה אישית"
        />
        <button onClick={handleSaveNote}>שמור</button>
      </div>
    </div>
  );
}

export default Segment_And_Note;
