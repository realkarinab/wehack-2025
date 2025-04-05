function isDateWithLocation(text) {
    return /\b\w{3}, \w{3} \d{1,2}, \d{4}.+/.test(text);
  }
  
  function addSoundButtons() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (isDateWithLocation(node.nodeValue)) {
        const span = document.createElement('span');
        span.textContent = node.nodeValue;
  
        const soundBtn = document.createElement('img');
        soundBtn.src = chrome.runtime.getURL('sound.png');
        soundBtn.alt = 'Sound';
        soundBtn.style.width = '16px';
        soundBtn.style.height = '16px';
        soundBtn.style.marginLeft = '6px';
        soundBtn.style.cursor = 'pointer';
        soundBtn.title = 'Play associated memory';
  
        soundBtn.addEventListener('click', () => {
          alert(`Clicked sound button for: ${node.nodeValue}`);
        });
  
        const wrapper = document.createElement('span');
        wrapper.appendChild(span);
        wrapper.appendChild(soundBtn);
  
        const parent = node.parentNode;
        if (parent) {
          parent.replaceChild(wrapper, node);
        }
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", addSoundButtons);
  window.addEventListener("load", addSoundButtons);
  setTimeout(addSoundButtons, 2000);
  