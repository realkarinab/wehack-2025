console.log("Popup loaded");

const clientId = 'd320778d84384745a25c942836dc6b86'; // Replace with your actual client ID
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

    // Get user's top tracks (short-term, medium-term, long-term)
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
    if (response.status === 204) {
      console.log('No track is currently playing.');
      return null;
    }
    return response.json();
  })
  .then(data => {
    if (data) {
      console.log('Currently Playing:', data);

      // Extract album image
      const albumImage = data.item.album.images[0]?.url; // Get the largest image
      if (albumImage) {
        const imgElement = document.getElementById('currently-playing-image') || document.createElement('img');
        imgElement.id = 'currently-playing-image';
        imgElement.src = albumImage;
        imgElement.alt = 'Album Art';
        imgElement.style.width = '200px'; // Adjust size as needed
        document.body.appendChild(imgElement);
      }
    }
  })
  .catch(error => console.error('Error fetching currently playing:', error));
}

function getTopTracks(accessToken) {
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

      if (data.items && data.items.length > 0) {
        const topTracksList = document.getElementById('top-tracks-list') || document.createElement('div');
        topTracksList.id = 'top-tracks-list';

        

        const trackList = document.createElement('ol');
        data.items.forEach(track => {
          const trackItem = document.createElement('li');
          trackItem.style.display = 'flex'; // Align items horizontally
          trackItem.style.alignItems = 'center'; // Vertically center the image and text
          trackItem.style.marginBottom = '10px';
          trackItem.style.marginRight = '40px';
        
          // Create a container for the song (image, text, and play button)
          const songContainer = document.createElement('div');
          songContainer.className = 'titleContainer'; // Apply the CSS class

          // Add album image
          const albumImage = track.album.images[0]?.url; // Get the largest image
          if (albumImage) {
            const imgElement = document.createElement('img');
            imgElement.src = albumImage;
            imgElement.alt = 'Album Art';
            imgElement.style.width = '60px'; // Adjust size as needed
            imgElement.style.height = '60px'; // Ensure the image is square
            imgElement.style.marginRight = '10px'; // Add spacing between image and text
            imgElement.style.marginLeft = '0px'; // Remove any left margin to move it to the left
            imgElement.style.borderRadius = '8px'; // Add rounded corners
            songContainer.appendChild(imgElement); // Append image to the song container
          }

          // Create a container for the text (track name and artist)
          const textContainer = document.createElement('div');
          textContainer.style.display = 'flex';
          textContainer.style.flexDirection = 'column'; // Stack track name and artist vertically
          textContainer.style.justifyContent = 'center'; // Vertically center the text
          textContainer.style.marginLeft = '5px'; // Add spacing between the image and text
          textContainer.style.flex = '1'; // Allow the text container to take up remaining space

          // Add track name
          const trackName = document.createElement('span'); // Use a <span> element for the track name
          trackName.textContent = track.name;

          // Apply styles to the track name
          trackName.style.fontFamily = "'Jua', sans-serif"; // Use the Jua font
          trackName.style.fontSize = "14px"; // Adjust font size
          trackName.style.fontWeight = "bold"; // Make the title bold
          trackName.style.color = "#333"; // Change text color

          // Add artist name
          const artistName = document.createElement('div'); // Use a <div> element for the artist name
          artistName.textContent = `by ${track.artists.map(artist => artist.name).join(', ')}`;

          // Apply styles to the artist name
          artistName.style.fontFamily = "'Jua', sans-serif"; // Use the Jua font
          artistName.style.fontSize = "12px"; // Adjust font size
          artistName.style.fontWeight = "normal"; // Make the artist name not bold
          artistName.style.color = "rgb(165, 66, 106)"; // Change text color to a lighter shade

          // Append track name and artist name to the text container
          textContainer.appendChild(trackName);
          textContainer.appendChild(artistName);

          // Append the text container to the song container
          songContainer.appendChild(textContainer);

          // Add play button
          const playButton = document.createElement('button');
          playButton.className = 'play-btn'; // Add the class for styling

          // Add play button image
          const playButtonImage = document.createElement('img');
          playButtonImage.src = '/assets/playbutton.png'; // Path to your play button image
          playButtonImage.alt = 'Play';
          playButtonImage.className = 'playbtn'; // Add the class for styling

          playButton.appendChild(playButtonImage);

          // Add click event to open Spotify song page
          playButton.addEventListener('click', () => {
            window.open(track.external_urls.spotify, '_blank');
          });

          // Append the play button to the song container
          songContainer.appendChild(playButton);

          // Append the song container to the track item
          trackItem.appendChild(songContainer);

          // Append the track item to the track list
          trackList.appendChild(trackItem);
        });

        topTracksList.appendChild(trackList);
        document.body.appendChild(topTracksList);
      }
    })
    .catch(error => console.error('Error fetching top tracks:', error));
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