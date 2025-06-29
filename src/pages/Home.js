import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Home() {
  const { userId } = useParams(); 
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const username = userInfo.user_userName || "";
console.log("userInfo in Home:", userInfo);

  return (
    
   <>
   <h3>{username} שלום</h3>
   <h1>בלכתך בדרך</h1>
   <pre>ברוך הבא לאתר "בלכתך בדרך" ,מערכת לניהול מניינים
    החזון שלנו ב"בלכתך בדרך" הוא להרבות תפילה בעם ישראל
    להנגיש את האפשרות לתפילה במניין לכל אחד בכל מקום
   </pre>
   <div>
   </div>
   <Outlet/>
   </>
  );
}

export default Home;
//המניינים והחיזוקים והפתקים די אותו הדבר לבדוק אופציה לקומפוננטה  משותפת