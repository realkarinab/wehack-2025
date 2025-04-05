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
  Object.assign(btn.style, {
    width: "20px",
    height: "20px",
    backgroundColor: "#FFA7CA",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "0",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "20px",
    fontSize: "12px",
  });
  btn.textContent = "+";

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