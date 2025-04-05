console.log("Popup loaded");

document.getElementById("get-content")?.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => document.body.innerText,
    }, (results) => {
      const content = results?.[0]?.result || "Unable to retrieve content.";
      document.getElementById("page-content").innerText = content;
    });
  }
});

document.getElementById("connectSpotify").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "spotify-auth" });
  fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .then(data => console.log(data));
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("connectSpotify");
  if (button) {
    button.addEventListener("click", function () {
      chrome.runtime.sendMessage({ action: "spotify-auth" });
    });
  } else {
    console.error("connectSpotify button not found.");
  }
});

