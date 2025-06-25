import React, { useEffect, useState } from "react";
import Daily_Segment from '../components/Daily_Segment'; 
import '../style/Style_segment_note.css';

function Segment_And_Note() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setToday(currentDate);

    async function fetchNote() {
      try {
        const res = await fetch(`http://localhost:3001/notes?date=${currentDate}`);
        if (!res.ok) throw new Error("לא נמצאה הערה");
        const data = await res.json();
        setNote(data.note || "");
      } catch (err) {
        console.log("אין הערה קיימת, מתחילים חדשה.");
        setNote("");
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, []);

  const handleSaveNote = async () => {
    try {
      const res = await fetch(`http://localhost:3001/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          note: note
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
