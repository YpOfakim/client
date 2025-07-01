import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Add_Note from "../components/Add_Note";
import "../style/Style_my_notes.css";

function My_Notes() {
  const {userId } = useParams();
  const [today, setToday] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshNotes, setRefreshNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setToday(currentDate);
  }, []);

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
  }, [userId, refreshNotes]);

  
const handleEdit = async (note) => {

  const updatedNote = {
    note_title: note.note_title, 
    body: note.body,
    note_date: today
  };

  try {
    const res = await fetch(`http://localhost:3001/notes/${note.note_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote)
    });

    if (!res.ok) throw new Error("שגיאה בעדכון ההערה");

    const data = await res.json();
    console.log("הערה עודכנה:", data);

    // תרענן את ההערות
    setRefreshNotes(prev => !prev);
    setSelectedNote(null);

  }
  catch (err) {
    console.error("שגיאה בעדכון ההערה:", err);
  }
};

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3001/notes/${selectedNote.note_id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("שגיאה במחיקת ההערה");
      setSelectedNote(null);
      setRefreshNotes(prev => !prev);
    } catch (err) {
      console.error("שגיאה במחיקת ההערה:", err);
    }
  };

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
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
                setEditTitle(note.note_title);
                setEditBody(note.body);
              }}
            >
              <strong>{note.note_title}</strong>
              <div className="note-date">{formatDate(note.note_date)}</div>
            </div>
          ))}
        </div>

        {selectedNote && (
          <div className="selected-note-body">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <button onClick={() => handleEdit({
                  ...selectedNote,
                  note_title: editTitle,
                  body: editBody
                })}>
                  שמור עדכון
                </button>
                <button onClick={() => setIsEditing(false)}>ביטול</button>
              </>
            ) : (
              <>
                <h4>{selectedNote.note_title}</h4>
                <div className="note-body">{selectedNote.body}</div>
                <button onClick={() => setIsEditing(true)}>ערוך</button>
                <button onClick={handleDelete}>מחק</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default My_Notes;
