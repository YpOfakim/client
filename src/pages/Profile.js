import React, { useState } from 'react';

function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {}
  );
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(userInfo);
const user_id = userInfo.user_id;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    console.log("form לפני שליחה:", form); // הדפס את כל האובייקט
const { id, ...fieldsToUpdate } = form;

    console.log("fieldsToUpdate:", fieldsToUpdate);



const res = await fetch(`http://localhost:3001/users/${user_id}`, {
  method: 'PUT',
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(fieldsToUpdate),
});


    if (!res.ok) {
      throw new Error('שגיאה בעדכון המשתמש');
    }

    const updatedUser = await res.json();
    setUserInfo(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setEditMode(false);
  } catch (err) {
    alert(err.message || 'שגיאת שרת');
  }
};




  return (
    <>
      <h1>פרופיל משתמש</h1>

      {editMode ? (
        <>
          <input
            name="user_name"
            value={form.user_name || ''}
            onChange={handleChange}
            placeholder="שם"
          />
          <input
            name="user_userName"
            value={form.user_userName || ''}
            onChange={handleChange}
            placeholder="שם משתמש"
          />
          <input
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="אימייל"
          />
          <input
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            placeholder="טלפון"
          />
          <button onClick={handleSave}>שמור</button>
          <button onClick={() => setEditMode(false)}>ביטול</button>
        </>
      ) : (
        <>
          <h5>שם: {userInfo.user_name}</h5>
          <h5>שם משתמש: {userInfo.user_userName}</h5>
          <h5>אימייל: {userInfo.email}</h5>
          <h5>טלפון: {userInfo.phone}</h5>
          <button onClick={() => setEditMode(true)}>ערוך</button>
        </>
      )}
    </>
  );
}

export default Profile;
