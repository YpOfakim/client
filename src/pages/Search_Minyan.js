import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';


function Search_Minyans() {
  // const { albumNum, userId } = useParams();
  const [minyans, setMinyans] = useState([]);
  const [selectedMinyan, setSelectedMinyan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);  // אם יש עוד תמונות להוריד
  const limit = 4; // מספר התמונות שנביא בכל פעם
  const start = useRef(0);  // משתנה שמכיל את המיקום שבו הפסקנו בטעינה האחרונה
  const minyansSetRef = useRef(null);

  // Function to fetch photos from server
  const fetchMinyans = () => {
    if (loading || !hasMore) return;  // If we're already loading or there's no more photos, don't fetch

    setLoading(true);  // Start loading
    fetch(`http://localhost:3001/minyans?start=${start.current}&_limit=${limit}`)
      .then((response) => response.json())
      .then((json) => {
        setMinyans((prevMinyans) => [...prevMinyans, ...json]); // Add new photos to the list
        start.current += limit; // Update the start index
        setLoading(false);

        // If the fetched photos are less than the limit, then there are no more photos to load
        if (json.length < limit) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Track scrolling and load more photos if we're at the bottom
  const handleScroll = () => {
    const container = photosContainerRef.current;
    if (container.scrollHeight - container.scrollTop === container.clientHeight && hasMore && !loading) {
      fetchMinyans(); // We're at the bottom, load more photos
    }
  };

  // Fetch initial photos when albumNum changes
  useEffect(() => {
    setMinyans([]);  // Reset photos when the album changes
    start.current = 0;  // Reset start position for fetching
    setHasMore(true);  // Allow loading more photos
    fetchMinyans();  // Fetch photos based on albumNum
  },[]);

  // Listen for scroll events to trigger fetching more photos
  useEffect(() => {
    const container = minyansSetRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Open modal when photo is clicked
  const handleMinyanClick = (photo) => {
    setSelectedMinyan(photo);
  };

  // Close modal
  const handleClose = () => {
    setSelectedMinyan(null);
  };

  // Fields for AddNew component
  // const photoFields = [
  //   { name: 'title', label: 'Title' },
  //   { name: 'url', label: 'URL' },
  //   { name: 'thumbnailUrl', label: 'Thumbnail URL' },
  // ];

  // Render the photos and the modal
  return (
    <>
      {/* <Link to={`/users/${userId}/posts/`} className="close-link">X</Link> */}

      <div>
        {/* <h3>Album No {albumNum}</h3> */}

        {/* AddNew component for adding new photos */}
{/* {        <AddNew
          setItemArray={setPhotos}  // Ensure setItemArray updates the photos state correctly
          allItemArray={photos}
          apiEndpoint="/photos"
          itemFields={photoFields}
          itemType="Photo"
          setFiltered={setPhotos}  // Make sure this doesn't overwrite the photos list unexpectedly
        />} */}

        {/* Container for the photos */}
        <div 
          ref={minyansSetRef} 
          className="minyans-container" 
          style={{ overflowY: 'scroll', height: '80vh' }}
        >
          {minyans.map((minyan, index) => (
            <Photo_Single
              key={index}
              minyan={minyan}
              minyans={minyans}
              onClick={() => handleMinyanClick(photo)}  // Open modal on photo click
              setMinyans={setMinyans}  // This can be removed or refactored if it's unnecessary
            />
          ))}
          {loading && <div>Loading...</div>} {/* Loading indicator */}
        </div>
      </div>

      {/* Modal component for showing the selected photo */}
      {selectedMinyan && (
        <Modal selectedMinyan={selectedMinyan} handleClose={handleClose} />
      )}
    </>
  );
}

export default Search_Minyans;
