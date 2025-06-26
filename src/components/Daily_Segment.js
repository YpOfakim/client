import React, { useEffect, useState } from "react";

function Daily_Segment({ selectedDate }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchDailyImage() {
    try {
      setLoading(true);
      console.log("🔍 שולח בקשה לתאריך:", selectedDate);
      console.log(selectedDate);

      const res = await fetch(`http://localhost:3001/daily/daily-page?date=${selectedDate}`);

      if (!res.ok) {
        throw new Error(`שגיאה בטעינת הדף. קוד סטטוס: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("image")) {
        throw new Error("התגובה אינה תמונה");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error("❌ שגיאה:", err.message);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  }

  if (selectedDate) {
    fetchDailyImage();
  }
}, [selectedDate]);

  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <h3>חיזוק ל־{new Date(selectedDate).toLocaleDateString("he-IL")}</h3>
      {loading ? (
        <p>טוען...</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Daily Segment"
          style={{
            maxWidth: "100%",
            maxHeight: "600px",
            borderRadius: "10px",
            boxShadow: "0 0 10px #ccc"
          }}
        />
      ) : (
        <p>אין חיזוק לתאריך זה.</p>
      )}
    </div>
  );
}

export default Daily_Segment;
