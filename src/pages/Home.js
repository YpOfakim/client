import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../style/Style_home.css';
function Home() {
  const { userId } = useParams(); 
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const username = userInfo.user_userName || "";
console.log("userInfo in Home:", userInfo);

  return (
    <div className='home-page'>
   <div className='home-container'>
      <h3>{username} שלום</h3>
       <h1>בלכתך-בדרך</h1>
       <pre>
       ברוך הבא לאתר "בלכתך בדרך" – מערכת חדשנית שנבנתה באהבה ובכוונה טהורה לחזק את עניין התפילה בעם ישראל.
       האפליקציה שלנו נועדה להנגיש את התפילה במניין לכל יהודי, בכל מקום ובכל זמן.
       
       באתר תוכל למצוא סידור תפילה מלא, לצד חיזוקים יומיים בענייני תפילה שנכתבים ומתווספים מדי יום כדי להאיר את הלב ולעורר את החשק לתפילה מכל הלב.
       
       גולת הכותרת של המערכת היא האפשרות ליצור מניין בכל מקום – בין אם אתה בטיול, בשטח, או במקום נידח – ולהזמין אחרים להצטרף. בנוסף, תוכל בקלות לחפש מניין קיים בקרבת מקום ולהתחבר אליו.
       
       אנו מקווים ומייחלים שהמערכת הזו תהיה כלי עזר אמיתי להרבות תפילה בציבור, לקרב לבבות ולהגדיל קדושה בישראל.
       </pre>
      <Outlet/>
   </div>
      </div>
  );
}

export default Home;
