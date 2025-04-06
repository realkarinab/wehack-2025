function addSoundButtons() {
  const dateLocationContainers = document.querySelectorAll("div.xA0gfb");
  const dateRegex = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4}/; // Simplified date regex

  dateLocationContainers.forEach((el) => {
    const text = el.textContent?.trim();

    if (text && dateRegex.test(text) && !el.querySelector(".sound-btn")) {
      const btn = createSoundButton(text);
      el.appendChild(btn);
    }
  });
}

function createSoundButton(text) {
  const btn = document.createElement("button");
  btn.className = "sound-btn";
  
  // Apply larger size and margin to the button
  Object.assign(btn.style, {
    width: "30px",  // Increase width
    height: "30px",  // Increase height
    backgroundColor: "#FFA7CA",  // Pink background
    border: "none",
    borderRadius: "50%",  // Circular button
    cursor: "pointer",
    padding: "0",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "30px",  // Adjust line height for larger button
    fontSize: "16px",  // Increase font size for larger text or icon
    marginLeft: "10px",  // Add margin between text and button
  });
  
  // Create an img element for the sound icon
  const img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/256/709/709559.png";  // Path to your image
  img.alt = "Sound icon"; // Alt text for the image
  img.style.width = "20px";  // Adjust size of the image
  img.style.height = "20px"; // Adjust size of the image
  img.style.marginTop = "4px"
  
  // Append the image to the button
  btn.appendChild(img);

  
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
  
    // Retrieve the top tracks from chrome.storage
    chrome.storage.local.get('topTracks', (result) => {
      const topTracks = result.topTracks;
  
      if (!topTracks || topTracks.length === 0) {
        alert('No top tracks found. Please connect to Spotify and try again.');
        return;
      }
  
      // Select a random track or the first track to display
      const track = topTracks[0]; // You can change this logic to match your requirements
      displaySongDetails(track);
    });
  });

  function getAndDisplaySongOnDate(accessToken, detectedDate) {
    fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Liked Songs:", data);
  
        // Filter tracks by the detected date
        const tracksByDate = data.items.filter((item) => {
          const addedAt = new Date(item.added_at).toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
          return addedAt === detectedDate;
        });
  
        if (tracksByDate.length > 0) {
          const track = tracksByDate[0].track; // Get the first track added on that date
          displaySongDetails(track);
        } else {
          alert(`No songs were added to your Liked Songs on ${detectedDate}.`);
        }
      })
      .catch((error) => console.error("Error fetching liked songs:", error));
  }

  function displaySongDetails(track) {
    // Create or select a container for displaying song details
    let songDetailsContainer = document.getElementById("song-details-container");
    if (!songDetailsContainer) {
      songDetailsContainer = document.createElement("div");
      songDetailsContainer.id = "song-details-container";
      Object.assign(songDetailsContainer.style, {
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      });
      document.body.appendChild(songDetailsContainer);
    }
  
    // Clear previous content
    songDetailsContainer.innerHTML = "";
  
    // Add album image
    const albumImage = document.createElement("img");
    albumImage.src = track.album.images[0]?.url || "";
    albumImage.alt = "Album Art";
    albumImage.style.width = "100px";
    albumImage.style.height = "100px";
    albumImage.style.borderRadius = "10px";
    albumImage.style.marginBottom = "10px";
    songDetailsContainer.appendChild(albumImage);
  
    // Add track name
    const trackName = document.createElement("h3");
    trackName.textContent = track.name;
    trackName.style.margin = "10px 0";
    songDetailsContainer.appendChild(trackName);
  
    // Add artist name
    const artistName = document.createElement("p");
    artistName.textContent = `Artist: ${track.artists.map((artist) => artist.name).join(", ")}`;
    artistName.style.margin = "5px 0";
    songDetailsContainer.appendChild(artistName);
  
    // Add album name
    const albumName = document.createElement("p");
    albumName.textContent = `Album: ${track.album.name}`;
    albumName.style.margin = "5px 0";
    songDetailsContainer.appendChild(albumName);
  }

  
  return btn;
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);