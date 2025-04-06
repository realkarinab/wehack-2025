// In background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    // Just open the popup
    chrome.action.openPopup();
  }
});