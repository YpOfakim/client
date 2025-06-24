// components/Daily_Segment.jsx
import React, { useEffect, useState } from "react";

function Daily_Segment() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyImage() {
      try {
        const res = await fetch("http://localhost:3001/daily/daily-page");
        if (!res.ok) throw new Error("שגיאה בטעינת הדף היומי");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error("שגיאה:", err);
      }
      setLoading(false);
    }

    fetchDailyImage();
  }, []);

  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <h3>חיזוק יומי</h3>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <img
          src={imageUrl}
          alt="Daily Segment"
          style={{ maxWidth: "100%", maxHeight: "600px", borderRadius: "10px", boxShadow: "0 0 10px #ccc" }}
        />
      )}
    </div>
  );
}

export default Daily_Segment;
