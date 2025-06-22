import { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import React from 'react';
function Login() {
  const [msg, setMsg] = useState();
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentPassWord, setCurrentPassWord] = useState("");
  const [userArray, setUserArray] = useState([]);
  
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((json) => setUserArray(json))
      .catch((err) => console.error(err)); // טיפול בשגיאות
  }, []);

   // פונקציה לכניסת משתמש קיים
   const handleSubmit = (e) => {
    e.preventDefault();
console.log(userArray);
    const userFound = userArray.find(u => u.username === currentUserName);
    console.log(userFound);
    if (userFound) {
     
      if (userFound.password === currentPassWord) {
        // עדכון localStorage

        localStorage.setItem('userFound', JSON.stringify(userFound));
      

        navigate(`/users/${userFound.id}/home`);
        }
        else{
          setMsg("password is incorrect");
          setTimeout(() => setMsg(''), 4000);
        }
      } else {
      setMsg("user doesn't exist");
      setTimeout(() => setMsg(''), 4000);
    }
    // ריקון השדות לאחר שליחת הטופס
    setCurrentUserName("");
    setCurrentPassWord("");
  };
  return (
    <>
          <h3> LogIn:</h3>
      <form id="userLogin">
        <input type="text" placeholder="userName" id="userNameLogin" value={currentUserName}
          onChange={(e) => setCurrentUserName(e.target.value)} />
        <input type="text" placeholder="password" id="userNamePassword" value={currentPassWord}
          onChange={(e) => setCurrentPassWord(e.target.value)}
        />
        <button onClick={handleSubmit}>submit</button>
        <div>{msg}</div>
      </form>
      <h3>New? </h3>
      <Link to="register"> <button> Register</button> </Link>
    </>
  );
}

export default Login;
