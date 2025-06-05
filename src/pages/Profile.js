import React, { useState } from 'react';

function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userFound")) || {}
  );
  const [form, setForm] = useState(userInfo);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUserInfo(form);
    localStorage.setItem("userFound", JSON.stringify(form));
    setEditMode(false);
  };

  return (
    <>
      <h1>Profile</h1>
      {editMode ? (
        <>
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" />
          <input name="username" value={form.username || ''} onChange={handleChange} placeholder="Username" />
          <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" />
          <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h5>name: {userInfo.name}</h5>
          <h5>username: {userInfo.username}</h5>
          <h5>email: {userInfo.email}</h5>
          <h5>phone: {userInfo.phone}</h5>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </>
  );
}

export default Profile;
