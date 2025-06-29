import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Daily_Segment from '../components/Daily_Segment'; 
import Add_Note from '../components/Add_Note';
import '../style/Style_segment_note.css';

function Segment_And_Note() {
  const { userId } = useParams();
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setToday(currentDate);
  }, []);

  return (
    <div className="segment-container">
      <div className="segment-image">
        <Daily_Segment selectedDate={today} />
      </div>

      {/* מזמן את הקומפוננטה החדשה */}
      <Add_Note userId={userId} today={today} />
    </div>
  );
}

export default Segment_And_Note;
