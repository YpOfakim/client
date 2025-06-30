import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../App"; // או מה שצריך בהתאם למיקום שלך

function Login() {
  // ניקוי נתונים קודמים מה־localStorage
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentSpe");
  }, []);
const { onLogin } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();  // מונע ריענון דף

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, password }),
      });

      const text = await response.text();
      const data = JSON.parse(text);
console.log("before");
console.log(data);

      if (response.ok && data.token) {
        console.log("in");

onLogin(data.token, data.user);

      } else {
        throw new Error(data.message || "שגיאה בהתחברות");
      }
    } catch (err) {
      setError(err?.message || "אירעה שגיאה לא צפויה");
      setUserName("");
      setPassword("");
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form className="login" onSubmit={handleLogin}>
      <h1>התחברות</h1>

      {error && <p className="error-message">{error}</p>}

      <input
        type="text"
        placeholder="שם משתמש"
        value={userName}
        onChange={handleInputChange(setUserName)}
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
          tabIndex={-1}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button type="submit" disabled={!userName || !password}>
        התחבר
      </button>
    </form>
  );
}


export default Login;
