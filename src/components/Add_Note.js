import React, { useState, useEffect } from "react";
// import '../style/Style_Add_Note.css';

function Add_Note({ userId, today }) {
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveMessageType, setSaveMessageType] = useState(""); // "success" / "error"

  const handleSaveNote = async () => {
    if (!title.trim()) {
      setSaveMessage("אנא הזן כותרת להערה");
      setSaveMessageType("error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          note: note,   // יכול להיות ריק
          title: title,
          userId: userId
        })
      });

      if (!res.ok) throw new Error("שגיאה בשמירת ההערה");

      setSaveMessage("ההערה נשמרה בהצלחה!");
      setSaveMessageType("success");
      setNote("");
      setTitle("");
    } catch (err) {
      setSaveMessage("אירעה שגיאה בשמירה בדוק/י אם כתבת בגוף ההערה טקסט");
      setSaveMessageType("error");
      console.error(err);
    }
  };

  return (
    <div className="segment-note">
      <h3>הערה אישית</h3>
      <input
       className="note-title-input"
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

      {saveMessage && (
        <p className={`save-message ${saveMessageType}`}>
          {saveMessage}
        </p>
      )}
    </div>
  );
}

export default Add_Note;
