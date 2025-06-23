import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthContext';
import Prayer from '../components/Prayer'; 
 function Sidur() {
  const { prayerName } = useParams();

  return (
    <div>
      <h2>תפילה: {prayerName}</h2>
      <Prayer />
    </div>
  );
}
export default Sidur;

