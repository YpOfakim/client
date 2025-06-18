import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Home() {
  const { userId } = useParams(); 
  return (
    
   <>
   <h3>user {userId}</h3>
   <div>
   </div>
   <Outlet/>
   </>
  );
}

export default Home;
//המניינים והחיזוקים והפתקים די אותו הדבר לבדוק אופציה לקומפוננטה  משותפת