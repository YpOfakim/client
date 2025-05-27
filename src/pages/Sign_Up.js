import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import React from 'react';

function Register() {

  const [msg, setMsg] = useState();
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentPassWord, setCurrentPassWord] = useState("");
  const [changePage,setChangePage]=useState(false)
  const [userArray, setUserArray] = useState([]);
  const navigate = useNavigate();
  const [newUserData, setNewUserData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: ""
      }
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: ""
    },
  });
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((json) => setUserArray(json))
      .catch((err) => console.error(err));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // טיפול בשדות מקוננים כמו address.geo
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setNewUserData((prev) => ({
        ...prev,
        [outerKey]: {
          ...prev[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      setNewUserData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmitRegister1 = (e) => {
    e.preventDefault();
    const userFound = userArray.find((u) => u.username === newUserData.username);

    if (!userFound) {
      if (newUserData.password === newUserData.verifyPassword) {
      // מעבר לדף הבא
      setChangePage(true)
      } else {
        setMsg('Passwords do not match');
        setTimeout(() => setMsg(''), 4000);
      }
    } else {
      setMsg("User already exists");
      setTimeout(() => setMsg(''), 4000);
    }
  };
  const handleSubmitRegister2 = (e) => {

 
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // מוודא שהשרת מבין שזה JSON
      },
      body: JSON.stringify(newUserData), // ממיר את formData למחרוזת JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Successfully added:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
  localStorage.setItem('userFound', JSON.stringify(newUserData.username));

    e.preventDefault();
  
    navigate('/home')
  };
 
  return (
    <>
      <h3>Register:</h3>

      {!changePage &&( <form id="userRegister">
        <input type="text" placeholder="userName" id="userNameRegister" value={newUserData.username}
          onChange={handleChange}   name="username"/>
        <input type="text" placeholder="password" id="userNameRegister" value={newUserData.password}
          onChange={handleChange}   name="password"/>
        <input type="text" placeholder="verify password" id="verifyRegister" value={newUserData.verifyPassword}
          onChange={handleChange}  name="verifyPassword"/>

        <button onClick={handleSubmitRegister1}>submit</button>
        <div>{msg}</div>
      </form>)}
      {changePage &&

    ( 
      <form> 
        <h3>Personal Details:</h3>
        <input
      type="text"
      placeholder="ID"
      id="id"
      name="id"
      value={newUserData.id}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Name"
      id="name"
      name="name"
      value={newUserData.name}
      onChange={handleChange}
    />
  
    <input
      type="email"
      placeholder="Email"
      id="email"
      name="email"
      value={newUserData.email}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Street"
      id="street"
      name="address.street"
      value={newUserData.address.street}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Suite"
      id="suite"
      name="address.suite"
      value={newUserData.address.suite}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="City"
      id="city"
      name="address.city"
      value={newUserData.address.city}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Zipcode"
      id="zipcode"
      name="address.zipcode"
      value={newUserData.address.zipcode}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Latitude"
      id="lat"
      name="address.geo.lat"
      value={newUserData.address.geo.lat}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Longitude"
      id="lng"
      name="address.geo.lng"
      value={newUserData.address.geo.lng}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Phone"
      id="phone"
      name="phone"
      value={newUserData.phone}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Website"
      id="website"
      name="website"
      value={newUserData.website}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Company Name"
      id="companyName"
      name="company.name"
      value={newUserData.company.name}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Company Catchphrase"
      id="companyCatchPhrase"
      name="company.catchPhrase"
      value={newUserData.company.catchPhrase}
      onChange={handleChange}
    />
    <input
      type="text"
      placeholder="Company BS"
      id="companyBS"
      name="company.bs"
      value={newUserData.company.bs}
      onChange={handleChange}
    />
          <button onClick={handleSubmitRegister2}>submit</button>
          <div>{msg}</div>
        </form>)}
    </>

  );
}

export default Register;
