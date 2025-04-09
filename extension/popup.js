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
      
      storeTopTracks(shortTermTracks, mediumTermTracks, longTermTracks);
      
      // Update UI with top tracks if needed
      updateTopTracksUI(shortTermTracks, mediumTermTracks, longTermTracks);
    })
    .catch(error => console.error('Error fetching top tracks:', error));
}

function storeTopTracks(shortTerm, mediumTerm, longTerm) {
  chrome.storage.local.set({
    shortTermTracks: shortTerm,
    mediumTermTracks: mediumTerm,
    longTermTracks: longTerm
  }, () => {
    console.log('Top tracks saved to storage');
  });
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

document.addEventListener('DOMContentLoaded', function() {
  // Load both short-term and long-term tracks from Chrome storage
  chrome.storage.local.get(['shortTermTracks', 'longTermTracks'], function(result) {
      const shortTermTracks = result.shortTermTracks || [];
      const longTermTracks = result.longTermTracks || [];
      
      // Display 2 random songs from short-term tracks for recently revisited
      // Display recently revisited songs (first 2 tracks)
      populateSongContainers('revisited-songs-container', shortTermTracks.slice(9, 11));
      
      // Display 1 random song from long-term tracks for recommendations
      const randomRecommendedTracks = getRandomTracks(longTermTracks, 1);
      populateSongContainers('recommended-songs-container', randomRecommendedTracks);
  });
});

/**
* Select a specific number of random tracks from an array of tracks
* @param {Array} tracks - Array of track objects
* @param {number} count - Number of random tracks to select
* @returns {Array} - Array of randomly selected tracks
*/
function getRandomTracks(tracks, count) {
  // Return empty array if tracks is empty or undefined
  if (!tracks || tracks.length === 0) {
      return [];
  }
  
  // Return all tracks if count is greater than available tracks
  if (count >= tracks.length) {
      return [...tracks];
  }
  
  // Shuffle the tracks array and take the first 'count' elements
  const shuffled = [...tracks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function populateSongContainers(containerId, tracks) {
  const container = document.getElementById(containerId);
  
  // Clear any existing content
  container.innerHTML = '';
  
  // If no tracks are available
  if (!tracks || tracks.length === 0) {
      container.innerHTML = '<p>No tracks available. Connect to Spotify to see your songs.</p>';
      return;
  }
  
  // Create song containers for each track
  tracks.forEach(track => {
      const songContainer = createSongContainer(track);
      container.appendChild(songContainer);
  });
}

function createSongContainer(track) {
  // Create the main container div
  const songContainer = document.createElement('div');
  songContainer.className = 'songContainer';
  
  // Create album cover image
  const albumCover = document.createElement('img');
  albumCover.src = track.album.images[0].url;
  albumCover.className = 'albumCover';
  
  // Create song info container
  const songInfo = document.createElement('div');
  songInfo.className = 'songInfo';
  
  // Create song title
  const songTitle = document.createElement('h2');
  songTitle.className = 'song-title';
  songTitle.textContent = track.name;
  
  // Create artist name
  const songArtist = document.createElement('p');
  songArtist.className = 'song-artist';
  songArtist.textContent = track.artists.map(artist => artist.name).join(', ');
  
  // Create play button link
  const playLink = document.createElement('a');
  playLink.href = track.external_urls.spotify;
  playLink.target = '_blank';
  
  const playButton = document.createElement('button');
  playButton.className = 'play-btn';
  
  const playButtonImg = document.createElement('img');
  playButtonImg.src = '/assets/playbutton.png';
  playButtonImg.className = 'playbtn';
  
  // Assemble the components
  playButton.appendChild(playButtonImg);
  playLink.appendChild(playButton);
  songInfo.appendChild(songTitle);
  songInfo.appendChild(songArtist);
  
  songContainer.appendChild(albumCover);
  songContainer.appendChild(songInfo);
  songContainer.appendChild(playLink);
  
  return songContainer;
}


function getRecommendations(accessToken) {
  const seedTracks = ['5YqEzk3C5c3UZ1D5fJUlXA', '2vPMoMDXxu9uX1igWZmXSG'];
  const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(',')}&limit=5`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Spotify Recommendations API error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Recommended Songs:', data.tracks);
      // Optional: Display recommended songs in popup
      populateSongContainers('recommended-songs-container', data.tracks);
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error);
    });
}


