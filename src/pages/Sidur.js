import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthContext';
import Prayer from '../components/Prayer'; 
 function Sidur() {
  const { prayerName } = useParams();

  return (
    <div>
      <Prayer />
    </div>
  );
}
export default Sidur;

