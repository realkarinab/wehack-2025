console.log("Popup loaded");

const clientId = '691dff2a418740d6b26cdb8902a5d13f'; // Replace with your actual client ID
const redirectUri = chrome.identity.getRedirectURL();
// Add user-top-read scope to access top tracks
const scopes = 'user-read-currently-playing user-read-playback-state user-top-read';

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Use querySelector instead and check if element exists
  const connectButton = document.getElementById('connect-spotify');
  const authStatus = document.getElementById('auth-status');
  
  // Ensure elements exist before adding event listeners
  if (connectButton) {
    connectButton.addEventListener('click', () => {
      chrome.identity.launchWebAuthFlow({
        url: `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`,
        interactive: true
      }, function(redirect_url) {
        if (chrome.runtime.lastError || !redirect_url) {
          // Check if element exists before setting innerText
          if (authStatus) {
            authStatus.innerText = 'Authentication failed.';
          }
          console.error(chrome.runtime.lastError);
          return;
        }
        
        const accessToken = redirect_url.split('#access_token=')[1].split('&')[0];
        localStorage.setItem('spotify_access_token', accessToken);
        
        // Check if element exists before setting innerText
        if (authStatus) {
          authStatus.innerText = 'Successfully connected to Spotify!';
        }
        console.log('Spotify Access Token:', accessToken);

        // Get currently playing track
        getCurrentlyPlaying(accessToken);

        // Get user's top tracks (short-term, medium-term, long-term)
        getTopTracks(accessToken);
      });
    });
  } else {
    console.error("Connect button not found in the DOM");
  }
});

function getCurrentlyPlaying(accessToken) {
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (!response.ok && response.status !== 204) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }
    // Spotify returns 204 No Content when nothing is playing
    if (response.status === 204) {
      console.log('No track is currently playing.');
      return null;
    }
    return response.json();
  })
  .then(data => {
    if (data) {
      console.log('Currently Playing:', data);
      // Update UI with currently playing track if needed
      const currentTrackElement = document.getElementById('current-track');
      if (currentTrackElement && data.item) {
        currentTrackElement.innerText = `Now Playing: ${data.item.name} by ${data.item.artists[0].name}`;
      }
    }
  })
  .catch(error => console.error('Error fetching currently playing:', error));
}

function getTopTracks(accessToken) {
  // Arrays to store the top tracks for each time range
  let shortTermTracks = [];
  let mediumTermTracks = [];
  let longTermTracks = [];

  // Fetching short-term tracks (last 4 weeks)
  fetchTopTracks('short_term', accessToken)
    .then(tracks => shortTermTracks = tracks)
    .then(() => fetchTopTracks('medium_term', accessToken))
    .then(tracks => mediumTermTracks = tracks)
    .then(() => fetchTopTracks('long_term', accessToken))
    .then(tracks => longTermTracks = tracks)
    .then(() => {
      // At this point, all tracks have been fetched
      console.log('Short-Term Tracks:', shortTermTracks);
      console.log('Medium-Term Tracks:', mediumTermTracks);
      console.log('Long-Term Tracks:', longTermTracks);
      
      // Update UI with top tracks if needed
      updateTopTracksUI(shortTermTracks, mediumTermTracks, longTermTracks);
    })
    .catch(error => console.error('Error fetching top tracks:', error));
}

function updateTopTracksUI(shortTermTracks, mediumTermTracks, longTermTracks) {
  // Example function to update UI elements if they exist
  const shortTermElement = document.getElementById('short-term-tracks');
  const mediumTermElement = document.getElementById('medium-term-tracks');
  const longTermElement = document.getElementById('long-term-tracks');
  
  if (shortTermElement && shortTermTracks.length > 0) {
    shortTermElement.innerHTML = createTracksList(shortTermTracks);
  }
  
  if (mediumTermElement && mediumTermTracks.length > 0) {
    mediumTermElement.innerHTML = createTracksList(mediumTermTracks);
  }
  
  if (longTermElement && longTermTracks.length > 0) {
    longTermElement.innerHTML = createTracksList(longTermTracks);
  }
}

function createTracksList(tracks) {
  return tracks.slice(0, 10).map((track, index) => 
    `<li>${index + 1}. ${track.name} by ${track.artists[0].name}</li>`
  ).join('');
}

function fetchTopTracks(timeRange, accessToken) {
  // Fetch the top tracks for a specific time range
  return fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(`Top Tracks (${timeRange}):`, data);
    return data.items; // Return the list of tracks
  });
}