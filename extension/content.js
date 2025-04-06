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
    e.stopPropagation();
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
  popup.textContent = "Sound button clicked next to: " + text;
  
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
    width: "200px",
    textAlign: "center",
  });

  // Append the popup to the body
  document.body.appendChild(popup);

  // Auto-close popup after 3 seconds (optional)
  // setTimeout(() => {
  //   popup.remove();
  // }, 3000);
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);
