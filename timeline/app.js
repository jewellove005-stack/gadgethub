// ==========================================
// 1. REGISTER PWA SERVICE WORKER
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('PWA Service Worker registered successfully!', reg))
      .catch(err => console.error('Service Worker installation failed:', err));
  });
}

// ==========================================
// 2. LIVE OPENWEATHER API INTEGRATION
// ==========================================
const API_KEY = '7e831e5123dccd57cfec446930147961'; 

document.addEventListener('DOMContentLoaded', () => {
  const fetchButton = document.getElementById('search-btn');
  const cityInputField = document.getElementById('city-input');

  if (fetchButton) {
    fetchButton.addEventListener('click', async () => {
      // Cleans dashes or underscores out of names like Port-Harcourt smoothly
      const city = cityInputField.value.trim().replace(/[_-]/g, ' ');
      if (!city) {
        alert("Please enter a city name.");
        return;
      }

      try {
        const url = new URL('https://api.openweathermap.org/data/2.5/weather');
        url.searchParams.append('q', city);
        url.searchParams.append('units', 'metric');
        url.searchParams.append('appid', API_KEY);

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error('City not found or API error.');
        }

        const data = await response.json();

        // 🎯 THE ARRAY FIX: Added [0] index to read the weather list array correctly!
        const description = data.weather[0].description; 

        // Update your exact HTML layout identifiers
        document.getElementById('location-name').innerText = data.name;
        document.getElementById('temperature-digits').innerText = Math.round(data.main.temp);
        document.getElementById('weather-condition').innerText = 
          description.charAt(0).toUpperCase() + description.slice(1);

        // Hide offline banner on successful network resolution
        const offlineBanner = document.getElementById('offline-banner');
        if (offlineBanner) {
          offlineBanner.innerText = "";
          offlineBanner.style.padding = "0";
        }

      } catch (error) {
        console.error("API Fetch Error: ", error);
        
        // Dynamic fallback display block
        document.getElementById('location-name').innerText = "Offline Mode";
        document.getElementById('temperature-digits').innerText = "--";
        document.getElementById('weather-condition').innerText = "Unable to reach weather servers.";
        
        const offlineBanner = document.getElementById('offline-banner');
        if (offlineBanner) {
          offlineBanner.innerText = "⚠️ Error - Unable to fetch live weather details.";
          offlineBanner.style.backgroundColor = "#ff4a4a";
          offlineBanner.style.color = "white";
          offlineBanner.style.textAlign = "center";
          offlineBanner.style.padding = "10px";
        }
      }
    });
  }
});
