console.log("Popup loaded");

const clientId = '691dff2a418740d6b26cdb8902a5d13f'; // Replace with your actual client ID
const redirectUri = chrome.identity.getRedirectURL();
// Add user-top-read scope to access top tracks
const scopes = 'user-read-currently-playing user-read-playback-state user-top-read'; 

document.getElementById('connect-spotify')?.addEventListener('click', () => {
  chrome.identity.launchWebAuthFlow({
    url: `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`,
    interactive: true
  }, function(redirect_url) {
    if (chrome.runtime.lastError || !redirect_url) {
      document.getElementById('auth-status').innerText = 'Authentication failed.';
      console.error(chrome.runtime.lastError);
      return;
    }

    const accessToken = redirect_url.split('#access_token=')[1].split('&')[0];
    localStorage.setItem('spotify_access_token', accessToken);
    document.getElementById('auth-status').innerText = 'Successfully connected to Spotify!';
    console.log('Spotify Access Token:', accessToken);

    // Get currently playing track
    getCurrentlyPlaying(accessToken);
    
    // Get user's top tracks (short-term)
    getTopTracks(accessToken);
  });
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
    }
  })
  .catch(error => console.error('Error fetching currently playing:', error));
}

function getTopTracks(accessToken) {
  // The time_range parameter can be:
  // short_term (approximately last 4 weeks)
  // medium_term (approximately last 6 months)
  // long_term (calculated from several years of data, including all new data as it becomes available)
  
  fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20', {
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
    console.log('Top Tracks (Short Term):', data);
    
    // Display the top tracks in your UI if desired
    if (data.items && data.items.length > 0) {
      const topTracksList = document.getElementById('top-tracks-list') || document.createElement('div');
      topTracksList.id = 'top-tracks-list';
      
      // Clear any existing content
      topTracksList.innerHTML = '<h3>Your Top Tracks (Last 4 Weeks)</h3>';

      
      // Create list of tracks
      const trackList = document.createElement('ol');
      data.items.forEach(track => {
        const trackItem = document.createElement('li');
        trackItem.innerText = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        trackList.appendChild(trackItem);
      });
      
      topTracksList.appendChild(trackList);
      document.body.appendChild(topTracksList);
    }
  })
  .catch(error => console.error('Error fetching top tracks:', error));
}