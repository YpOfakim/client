import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Add_Note from "../components/Add_Note";
import "../style/Style_my_notes.css";

function My_Notes() {
  const { userId } = useParams();
  const [today, setToday] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshNotes, setRefreshNotes] = useState(false);


  const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

  // מחשב את תאריך היום
  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setToday(currentDate);
  }, []);

  // טוען את ההערות של המשתמש
useEffect(() => {
  async function fetchNotes() {
    try {
      const res = await fetch(`http://localhost:3001/notes/${userId}`);
      if (!res.ok) throw new Error("שגיאה בקבלת ההערות");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("שגיאה בטעינת ההערות:", err);
    }
  }

  fetchNotes();
}, [userId, refreshNotes]); // refreshNotes גורם לריצה מחדש


  return (
    <div className="my-notes-container">
      <div className="add-note-section">
        <Add_Note userId={userId} today={today} onNoteAdded={() => setRefreshNotes(prev => !prev)} />
      </div>

      <div className="notes-list-section">
        <div className="notes-list-box">
          {notes.map((note) => (
            <div 
              key={note.note_id} 
              className="note-title-item"
              onClick={() => setSelectedNote(note)}
            >
              <strong>{note.note_title}</strong>
              <div className="note-date">{formatDate(note.note_date)}</div>
            </div>
          ))}
        </div>

        {selectedNote && (
          <div className="selected-note-body">
            <h4>{selectedNote.note_title}</h4>
           <div className="note-body">
             {selectedNote.body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default My_Notes;
