/**
 * Location Service - Handles geocoding and distance calculations
 * Uses OpenCage Geocoder for address → coordinates conversion
 */

const axios = require('axios');

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Geocode address to coordinates using OpenCage API
async function geocodeAddress(address, apiKey) {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: address,
        key: apiKey,
        limit: 1
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      const formatted = response.data.results[0].formatted;
      return { latitude: lat, longitude: lng, formatted };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

// Reverse geocode (coordinates → address)
async function reverseGeocode(lat, lon, apiKey) {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: `${lat},${lon}`,
        key: apiKey,
        limit: 1
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return null;
  }
}

// Get nearby users/pets based on location
function getNearbyItems(items, userLat, userLon, maxDistance = 50) {
  return items.filter(item => {
    if (!item.latitude || !item.longitude) return false;
    const distance = calculateDistance(
      userLat, userLon,
      parseFloat(item.latitude), parseFloat(item.longitude)
    );
    item.distance = distance; // Add distance to object
    return distance <= maxDistance;
  }).sort((a, b) => a.distance - b.distance);
}

module.exports = {
  calculateDistance,
  geocodeAddress,
  reverseGeocode,
  getNearbyItems
};
