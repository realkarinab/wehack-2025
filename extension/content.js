function addSoundButtons() {
  const elements = Array.from(document.querySelectorAll("div, span, p"));
  const dateLocationRegex = /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4}(.*?)$/;

  elements.forEach((el) => {
    const text = el.textContent?.trim();
    // Only add the button if it matches the regex and isn't already appended
    if (text && dateLocationRegex.test(text) && !el.querySelector(".sound-btn")) {
      // Ensure that it's not appending the button to multiple parts of the date-location
      if (el.textContent.match(dateLocationRegex)) {
        const btn = document.createElement("button");
        btn.className = "sound-btn";
        btn.style.width = "20px";
        btn.style.height = "20px";
        btn.style.backgroundColor = "#FFA7CA"; // pink background
        btn.style.border = "none"; // remove border
        btn.style.borderRadius = "50%"; // make it circular
        btn.style.cursor = "pointer";
        btn.style.padding = "0"; // no padding to make it compact
        btn.style.display = "inline-block";
        btn.style.textAlign = "center";
        btn.style.lineHeight = "20px"; // centers text inside the button
        btn.style.fontSize = "12px"; // for the text or icon inside the button
        btn.textContent = "+"; // text or icon, you can change this as per your needs

        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          alert("Sound button clicked next to: " + text);
        });

        el.appendChild(btn);
      }
    }
  });
}

const observer = new MutationObserver(() => addSoundButtons());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", addSoundButtons);
window.addEventListener("load", addSoundButtons);
