import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [msg, setMsg] = useState('');
  const [userArray, setUserArray] = useState([]);
  const [newUserData, setNewUserData] = useState({
    user_name: "",
    user_userName: "",
    email: "",
    password: "",
    verifyPassword: "",
    phone: ""
  });

  const navigate = useNavigate();

  // ניקוי לוקאל סטורג' בעת טעינה
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentSpe");
  }, []);

  // פונקציה להצגת הודעה זמנית
  const showMessage = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (newUserData.password !== newUserData.verifyPassword) {
      showMessage("הסיסמאות אינן תואמות");
      return;
    }

    if (newUserData.password.length < 6) {
      showMessage("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (newUserData.phone && !/^\d{9,10}$/.test(newUserData.phone)) {
      showMessage("מספר טלפון לא תקין");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "הרישום נכשל");
        return;
      }

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));

      navigate(`/user/${user.user_id}/home`);
    } catch (err) {
      console.error("שגיאה ברישום:", err);
      showMessage("שגיאת שרת: נסה שוב מאוחר יותר");
    }
  };

  return (
    <>
      <h3>Register:</h3>

      {msg && (
        <div style={{
          backgroundColor: "#ffe6e6",
          color: "#cc0000",
          padding: "10px",
          border: "1px solid #cc0000",
          borderRadius: "5px",
          marginBottom: "10px",
          maxWidth: "300px"
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmitRegister}>
        <input
          type="text"
          placeholder="Name"
          name="user_name"
          value={newUserData.user_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="UserName"
          name="user_userName"
          value={newUserData.user_userName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={newUserData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Verify Password"
          name="verifyPassword"
          value={newUserData.verifyPassword}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={newUserData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={newUserData.phone}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Register;
