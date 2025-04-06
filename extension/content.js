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
  // Check if a popup already exists, if so, remove it
  const existingPopup = document.querySelector(".sound-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create the popup
  const popup = document.createElement("div");
  popup.className = "sound-popup";
  popup.innerHTML = `
  <head> <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet"> </head>
  <div class="popup-header">

  <div class="titleContainer">
    <img src="https://i.ibb.co/7NYR909h/icon.png" alt="icon" class="icon"/>
    <h2>Trip Down Melody Lane</h2>
  </div>

  <br>
  <h3>Your songs for this day:</h3>

  <div class="songContainer">
    <img src="https://i.ibb.co/FkHNzysj/song1.png" class="albumCover">
    <div class="songInfo">
        <h2 class="song-title">APT.</h2>
        <p class="song-artist">ROSE, Bruno Mars</p>
    </div>
    <button class="play-btn"><img src="https://i.ibb.co/t0rsz6F/playbutton.png" class="playbtn"></button>
  </div>

  <div class="songContainer">
    <img src="https://i.ibb.co/PZkNf2ZB/song2.png" class="albumCover">
    <div class="songInfo">
        <h2 class="song-title">18dB</h2>
        <p class="song-artist">REmi</p>
    </div>
    <button class="play-btn"><img src="https://i.ibb.co/t0rsz6F/playbutton.png" class="playbtn"></button>
  </div>
  <div class="songContainer">
    <img src="https://i.ibb.co/DPbjkSwR/song3.png" class="albumCover">
    <div class="songInfo">
        <h2 class="song-title">If you say I love you</h2>
        <p class="song-artist">BOYNEXTDOOR</p>
    </div>
    <button class="play-btn"><img src="https://i.ibb.co/t0rsz6F/playbutton.png" class="playbtn"></button>
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
    width: "270px",
    textAlign: "center",
    borderImage: "linear-gradient(to bottom,rgb(255, rgb(255, 142, 159)), #FF8E98) 1", // Gradient border
    
    maxHeight: "80vh",  // Make the popup scrollable if content overflows
    overflowY: "auto",  // Add scroll bar if content overflows
    
  });

  // Append the popup to the body
  document.body.appendChild(popup);

  // Add an event listener to the document to detect clicks outside the popup
  document.addEventListener("click", (e) => {
    // Check if the click is outside the popup and button
    if (!popup.contains(e.target) && e.target !== button) {
      popup.remove();  // Remove the popup if clicked outside
    }
  });

  // Add scroll event listener to remove popup if the user scrolls
  window.addEventListener("scroll", () => {
    popup.remove();  // Remove the popup if the user scrolls
  }, { once: true });  // The `{ once: true }` ensures the event listener is removed after the first scroll event
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);
