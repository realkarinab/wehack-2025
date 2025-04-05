function addSoundButtons() {
  const dateLocationContainers = document.querySelectorAll("div.xA0gfb");
  const dateRegex = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4} || (?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z] ||(?:Today|Yesterday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)/; // Simplified date regex

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
  img.style.marginTop = "4px"
  
  // Append the image to the button
  btn.appendChild(img);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    alert("Sound button clicked next to: " + text);
  });
  return btn;
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);

