import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  // ניקוי נתונים קודמים מה־localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("currentSpe");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password }),
      });

      const text = await response.text();

      const data = JSON.parse(text);

      if (response.ok && data.token) {
        // שמירה ב־localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        // ניווט לדף הבא אחרי התחברות
    navigate(`/user/${data.user.user_id}/home`);   
     } 
    else {
        throw new Error(data.message || "שגיאה בהתחברות");
      }
    } catch (err) {
      const errorMessage =
        err?.message || "אירעה שגיאה לא צפויה";
      setError(errorMessage);
      setUsername("");
      setPassword("");
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // ניקוי הודעת שגיאה בזמן הקלדה
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login">
      <h1>התחברות</h1>

      {error && <p className="error-message">{error}</p>}

      <input
        type="text"
        placeholder="שם משתמש"
        value={username}
        onChange={handleInputChange(setUsername)}
      />

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="סיסמה"
          value={password}
          onChange={handleInputChange(setPassword)}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={toggleShowPassword}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button onClick={handleLogin}>התחבר</button>
    </div>
  );
}

export default Login;
