function addSoundButtons() {
  const dateLocationContainers = document.querySelectorAll("div.xA0gfb");
  const dateRegex = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4}|\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]|\b(?:Today|Yesterday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)/;

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

  // Apply styles to the button
  Object.assign(btn.style, {
    width: "30px",
    height: "30px",
    background: "linear-gradient(to bottom,rgba(255, 199, 208, 0.5),rgba(255, 167, 202, 0.5))", // 50% opacity
    border: "1.5px solid transparent",
    borderRadius: "50%", // Makes the button circular
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", // Optional shadow for button
    cursor: "pointer",
    padding: "0",
    marginRight: "5px",
    marginTop: "5px",
    marginBottom: "5px",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "30px",
    fontSize: "16px",
    marginLeft: "10px",
    outline: "2px solid #FF82D3", // Add an outline around the button
  });

  // Create an img element for the sound icon
  const img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/256/709/709559.png";
  img.alt = "Sound icon";
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.marginTop = "4px";

  // Append the image to the button
  btn.appendChild(img);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();  // Prevent event bubbling to document
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
    const yearClicked = match ? parseInt(match[0], 10) : 2025;

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
    // popup.style.border = "5px solid red";

    popup.innerHTML = `
  <head> <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet"> </head>
  <div class="popup-header">

  <div class="titleContainer">
    <img src="https://i.ibb.co/7NYR909h/icon.png" alt="icon" class="icon"/>
    <h2>Trip Down Melody Lane</h2>
  </div>`

    // Create the tracks list within the popup
    const tracksList = document.createElement("ul");
    if (randomTracks.length > 0) {
      const tracksHTML = createTracksList(randomTracks);
      tracksList.innerHTML = `<h3>Your songs for this day:</h3>${tracksHTML}`;
    }

// Apply styles to the popup
Object.assign(popup.style, {
  position: "absolute",
  top: `${button.getBoundingClientRect().top + window.scrollY + button.offsetHeight}px`, // Position it below the button
  left: `${button.getBoundingClientRect().left + window.scrollX}px`, // Align left with the button
  background: "linear-gradient(to bottom right,rgba(255, 172, 173, 0.8),rgba(232, 136, 185, 0.8))",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: "1000", // Make sure the popup is on top
  width: "320px",
  textAlign: "center",
  borderImage: "linear-gradient(to bottom,rgb(255, rgb(255, 142, 159)), #FF8E98) 1", // Gradient border
  
  maxHeight: "80vh",  // Make the popup scrollable if content overflows
  overflowY: "auto",  // Add scroll bar if content overflows
  
});

    // Append the tracks list to the popup
    popup.appendChild(tracksList);

    // Append the popup to the body
    document.body.appendChild(popup);

    // Add event listener to close the popup when clicking outside
    function closePopup(event) {
      if (!popup.contains(event.target) && event.target !== button) {
        document.body.removeChild(popup);
        document.removeEventListener('click', closePopup);
      }
    }
    document.addEventListener('click', closePopup);
  });
}

function getRandomTracks(tracks, number) {
  const shuffled = tracks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, number);
}

function createTracksList(tracks) {
  return tracks.map((track) => {
    const listItem = document.createElement('li');
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.marginBottom = '10px';
    // listItem.style.border = '3px solid red';
    listItem.style.margin = "0 20px";
    listItem.style.padding = '0';
    

    const img = document.createElement('img');
    img.src = track.album.images[0].url;
    img.alt = track.name;

    const textDiv = document.createElement('div');
    textDiv.innerHTML = `
    <div class="songContainer">
    <img src=${track.album.images[0].url} class="albumCover">
    <div class="songInfo">
        <h2 class="song-title">${track.name}</h2>
        <p class="song-artist">${track.artists[0].name}</p>
    </div>
      <a href= "${track.external_urls.spotify}" target="_blank">
        <button class="play-btn"><img src="https://i.ibb.co/t0rsz6F/playbutton.png" class="playbtn"></button>
      </a>
    </div>
    
    <style>
  body {
  margin: 0;
  font-family: sans-serif;
  background: linear-gradient(to bottom right, #FFC7D0, #f398c3);
}

.popup-container {
  width: 300px;
  padding: 16px;
  color: white;
  border-radius: 12px;
  box-sizing: border-box;

  
}

.icon {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  margin-right: 8px;
}

button {
  color: #800000;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.7); /* White with 60% opacity */
  width: 50px;
  height: 50px;
  transition: background-color 0.3s;
  border-radius: 40px;
  padding: 0px;
  margin: 0px;
  border: 5px solid rgb(255, 255, 255, 0.0);
}

.playbtn {
  width: 40px;
  height: 40px;
  

}
.button:hover {
  background-color: #e644b2;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 6px;
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
}

.sound-button {
  width: 24px;
  height: 24px;
  background-color: #FFA7CA;
  border: none;
  border-radius: 50%;
  margin-left: 8px;
  background-image: url('sound.png');
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.titleContainer {
  display: flex;
  justify-content: flex-start;
  background-color: white;
  background-color: rgba(255, 255, 255, 0.5); /* White with 60% opacity */
  width:auto;
  padding: 10px 20px;
  border-radius: 100px;

  box-shadow: 2px 2px 5px rgb(142, 80, 104, 0.5);
}

.songContainer {
  display: flex;
  justify-content: flex-start;
  background-color: rgba(255, 255, 255, 0.35); /* White with 45% opacity */
  width:auto;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 5px;
  
  box-shadow: 2px 2px 5px rgb(142, 80, 104, 0.5);
}

.songInfo {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 5px;
  /* border: 5px solid red; */

  flex-grow: 1;
  display: flex;
  padding: 0;
  justify-content: center;
  flex-direction: column;
}

.albumCover {
  width: 60px; /* Adjust the size of the album cover */
  height: 60px;
  border-radius: 15px;
  margin-right: 10px; /* Space between image and text */
}

h2, h3, h4, p {
  
  font-family: 'Jua';
  font-weight: normal;
  
  text-align: left;
}

h2 {
  color:black;
  font-size: medium;
  
  /* border: 2px solid red; */
}

h3 {
  color:black;
  margin-top: 5px;
  margin-bottom: 0;
  font-size: small;
}

h4 {
  font-size: smaller;
  color: black;
  margin: 0;
  /* margin-top: 5px; */
}

p {
  color:rgb(165, 66, 106);
  font-size: small;
  /* border: 2px solid red; */
}

.song-title {
  
  margin: 0; /* Remove default margin */
}

.song-artist {
  
  margin: 0; /* Remove default margin */
}

@font-face {
  font-family: 'Jua';
  src: url('Jua-Regular.eot'), url('Jua-Regular.ttf') format('truetype'), url('Jua-Regular.svg') format('svg');
  font-weight: normal;
  font-style: normal;
}

#newfont{
  font-family:'Jua';
}

  </style>
`;
    textDiv.style.flexGrow = 1;


    // listItem.appendChild(img);
    listItem.appendChild(textDiv);

    return listItem.outerHTML;
  }).join('');
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);
