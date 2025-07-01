// distanceUtils.js

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err)
    );
  });
}

export async function getLatLngFromAddress(address) {
  const res = await fetch(`http://localhost:3001/geocode/geocode?address=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data.status === 'OK') {
    return data.results[0].geometry.location;
  } else {
    throw new Error('Address not found');
  }
}

export async function getDistanceAndDuration(origin, destination, mode = 'driving') {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  const url = `http://localhost:3001/geocode/distance?origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destinationStr)}&mode=${mode}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
    const element = data.rows[0].elements[0];
    return {
      distance: element.distance.text,
      duration: element.duration.text,
      durationValue: element.duration.value,
    };
  } else {
    throw new Error('Failed to calculate distance');
  }
}
export function formatDateTime(datetimeStr) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Date(datetimeStr).toLocaleString('he-IL', options);
}