import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("currentSpe");
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

  // שליפת כל המשתמשים לבדיקה אם המשתמש קיים
  // useEffect(() => {
  //   fetch('http://localhost:3001/users')
  //     .then((res) => res.json())
  //     .then((data) => setUserArray(data))
  //     .catch((err) => console.error(err));
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmitRegister = async (e) => {
  e.preventDefault(); // ✅ מוסיף את זה כדי למנוע רענון

  // בדיקות מקדימות יכולות להיכנס כאן

  try {
    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    });

    const data = await response.json();
    console.log("🔍 Registration response:", data);

    if (!response.ok) {
      setMsg(data.message || "Registration failed");
      return;
    }

    const { token, user } = data;
    console.log("User registered:", user);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(user));

    navigate(`/user/${user.user_id}/home`);
  } catch (err) {
    console.error("Registration error:", err);
    setMsg("Registration failed");
  }
};


  return (
    <>
      <h3>Register:</h3>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

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
   };
export default Register;
