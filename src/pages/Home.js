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
// אפשרות לקומפוננטה משותפת לעמודים הזהים
// הרחבה 1
//צביעת טופס
// לחיצה על כפתור Info – תגרום להצגת המידע האישי של המשתמש במסך שיופיע על-גבי העמוד.
// לחיצה על כפתור Logout תוציא את המשתמש )תמחק את המידע ב- LS )ותחזיר לעמוד הכניסה.
//check if user i url matches ls
//PATCH
//Albums to photos opens in side
//error for server
//הדגשה בסרגל כלים