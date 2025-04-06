function addSoundButtons() {
  const dateLocationContainers = document.querySelectorAll("div.xA0gfb");
  const dateRegex = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4} || (?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z] ||(?:Today|Yesterday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)/;

  console.log(dateLocationContainers);
  dateLocationContainers.forEach((el) => {
    const text = el.textContent?.trim();
    console.log(text);

    if ((text && dateRegex.test(text)) && !el.querySelector(".sound-btn")) {
      const btn = createSoundButton(text);
      console.log("we in this hoe");
      el.appendChild(btn);
    }
  });
}

function createSoundButton(text) {
  console.log("we in this hoe");

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
  img.style.marginTop = "4px";

  // Append the image to the button
  btn.appendChild(img);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openPopup(e.target, text);
  });

  return btn;
}

function openPopup(button, text) {
  // Retrieve top tracks from chrome.storage.local
  chrome.storage.local.get(['shortTermTracks', 'mediumTermTracks', 'longTermTracks'], (result) => {
    console.log('Short-Term Tracks:', result.shortTermTracks);
    console.log('Medium-Term Tracks:', result.mediumTermTracks);
    console.log('Long-Term Tracks:', result.longTermTracks);

    // Extract the year from the clicked date text
    const dateRegex = /\d{4}/;
    const match = text.match(dateRegex);
    const yearClicked = match ? parseInt(match[0], 10) : null;

    let selectedTracks = [];

    // Select tracks based on the clicked year
    if (yearClicked === 2025 && result.shortTermTracks) {
      selectedTracks = result.shortTermTracks;
    } else if (yearClicked === 2024 && result.mediumTermTracks) {
      selectedTracks = result.mediumTermTracks;
    } else if (yearClicked && yearClicked < 2024 && result.longTermTracks) {
      selectedTracks = result.longTermTracks;
    }

    // Randomly select 3 songs from the selected tracks
    const randomTracks = getRandomTracks(selectedTracks, 3);

    // Create popup and display song information
    const popup = document.createElement("div");
    popup.className = "sound-popup";
    popup.textContent = `Sound button clicked next to: ${text}`;

    // Append the random tracks data to the popup
    if (randomTracks.length > 0) {
      popup.innerHTML += `<h3>Recommended Tracks:</h3><ul>${createTracksList(randomTracks)}</ul>`;
    }

    // Apply styles to the popup
    Object.assign(popup.style, {
      position: "absolute",
      top: `${button.getBoundingClientRect().top + window.scrollY + button.offsetHeight}px`, // Position it below the button
      left: `${button.getBoundingClientRect().left + window.scrollX}px`, // Align left with the button
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: "1000", // Make sure the popup is on top
      width: "350px",  // Adjust width to fit the song details and button
      textAlign: "left", // Left align the song details
    });

    // Append the popup to the body
    document.body.appendChild(popup);

    // Add event listener to close the popup when clicking outside
    document.addEventListener('click', function closePopup(event) {
      if (!popup.contains(event.target) && event.target !== button) {
        document.body.removeChild(popup);
        document.removeEventListener('click', closePopup);
      }
    });
  });
}

function getRandomTracks(tracks, number) {
  // Shuffle the tracks array and return the first 'number' tracks
  const shuffled = tracks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, number);
}

function createTracksList(tracks) {
  return tracks.map((track) => {
    const playButtonId = `play-button-${track.id}`;
    return `
      <li>
        <img src="${track.album.images[0].url}" alt="${track.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;"/>
        <span style="vertical-align: middle;">${track.name} by ${track.artists[0].name}</span>
        <button id="${playButtonId}" data-uri="${track.uri}" style="margin-left: 10px; padding: 5px 10px;">Play</button>
      </li>
    `;
  }).join('');
}

// Add event listener for play button clicks (delegated to document)
document.addEventListener('click', function(event) {
  if (event.target && event.target.matches('button[id^="play-button-"]')) {
    const spotifyUri = event.target.dataset.uri;
    if (spotifyUri) {
      // Send a message to the background script to play the track
      chrome.runtime.sendMessage({ action: 'playTrack', uri: spotifyUri });
    }
  }
});


const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);