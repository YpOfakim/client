import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import Prayer from '../components/Prayer'; // Assuming you have a Prayer component
// import { AuthProvider } from '../context/AuthContext'; // Assuming you have an AuthContext
import Prayer from '../components/Prayer'; // Import the Prayer component
 function Sidur() {
  const { prayerName } = useParams();

  return (
    <div>
      <h2>תפילה: {prayerName}</h2>
      <Prayer prayerName={prayerName} />
    </div>
  );
}
export default Sidur;