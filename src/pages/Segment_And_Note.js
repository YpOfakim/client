// components/Segment_And_Note.jsx
import React, { useEffect, useState } from "react";
import Daily_Segment from '../components/Daily_Segment'; 
import '../style/Style_segment_note.css';

function Segment_And_Note() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedNote = localStorage.getItem(`note_${today}`);
    setNote(savedNote || "");
    setLoading(false);
  }, []);

  const handleSaveNote = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`note_${today}`, note);
    alert("ההערה נשמרה!");
  };

return (
  <div className="segment-container">
    <div className="segment-image">
      {/* תמונת החיזוק היומי מהקומפוננטה Daily_Segment */}
      <Daily_Segment />
    </div>

    <div className="segment-note">
      <h3>הערה אישית</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="כתוב/כתבי כאן חיזוק אישי ליום..."
      />
      <button onClick={handleSaveNote}>שמור</button>
    </div>
  </div>
);
}

export default Segment_And_Note;
