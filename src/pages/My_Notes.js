useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setToday(currentDate);
    
    async function fetchNote() {
      try {
        const res = await fetch(`http://localhost:3001/notes?date=${currentDate}&userId=${userId}`);
        if (!res.ok) throw new Error("לא נמצאה הערה");
        const data = await res.json();
        setNote(data.note || "");
        setTitle(data.title || "");
      } catch (err) {
        console.log("אין הערה קיימת, מתחילים חדשה.");
        setNote("");
        setTitle("");
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [userId]);