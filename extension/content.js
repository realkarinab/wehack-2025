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
    width: "30px",
    height: "30px",
    backgroundColor: "#FFA7CA",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "0",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "30px",
    fontSize: "16px",
    marginLeft: "10px",
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
    e.stopPropagation();
    
    // Extract year from the date text
    const yearMatch = text.match(/\b(\d{4})\b/);
    const year = yearMatch ? parseInt(yearMatch[1]) : null;
    
    // Send a message to the background script with the date information
    chrome.runtime.sendMessage({
      action: "openPopupWithDate",
      dateText: text,
      year: year
    });
  });
  
  return btn;
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);