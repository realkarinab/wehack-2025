console.log("Popup loaded");

const clientId = '691dff2a418740d6b26cdb8902a5d13f'; // Replace with your actual client ID
const redirectUri = chrome.identity.getRedirectURL();
const scopes = 'user-read-currently-playing user-read-playback-state'; // Add the scopes you need

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

    // Now you can use the accessToken to make calls to the Spotify API
    // For example, to get currently playing track:
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
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
  });
});