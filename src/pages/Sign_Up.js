import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/register.css'; 
import { useContext } from 'react';
import { AuthContext } from '../App';


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
const { onLogin } = useContext(AuthContext);

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
if (newUserData.user_userName.length < 3) {
  showMessage("שם המשתמש חייב להכיל לפחות 3 תווים");
  return;
}if (newUserData.user_name.length < 3) {
  showMessage("שם המשתמש חייב להכיל לפחות 3 תווים");
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
console.log("Navigate to: ", `/user/${user.user_id}/home`);
onLogin(token, user);


    } catch (err) {
      console.error("שגיאה ברישום:", err);
      showMessage("שגיאת שרת: נסה שוב מאוחר יותר");
    }
  };

 return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmitRegister}>
        <h3>הרשמה</h3>

        {msg && (
          <div className="error-box">
            {msg}
          </div>
        )}

        <input
          type="text"
          placeholder="שם"
          name="user_name"
          value={newUserData.user_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="שם משתמש"
          name="user_userName"
          value={newUserData.user_userName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="סיסמה"
          name="password"
          value={newUserData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="אימות סיסמה"
          name="verifyPassword"
          value={newUserData.verifyPassword}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="אימייל"
          name="email"
          value={newUserData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="טלפון"
          name="phone"
          value={newUserData.phone}
          onChange={handleChange}
        />
        <button type="submit">הרשם</button>
        <button
        type="button"
        className="register-link"
        onClick={() => navigate("/sign_in")}
      >
        קיים לך כבר חשבון? לחץ כאן להתחברות
      </button>
      </form>
    </div>
  );
}

export default Register;
