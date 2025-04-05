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

console.log("Popup loaded");

let accessToken = null; // store the token here after auth

document.addEventListener("DOMContentLoaded", () => {
  const contentButton = document.getElementById("get-content");
  const spotifyButton = document.getElementById("connectSpotify");

  if (contentButton) {
    contentButton.addEventListener("click", async () => {
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
  }

  if (spotifyButton) {
    spotifyButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "spotify-auth" });
    });
  } else {
    console.error("connectSpotify button not found.");
  }
});

// Listen for token from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "spotify-token") {
    accessToken = message.token;
    console.log("Spotify Access Token received:", accessToken);

    // Now you can fetch user data
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => res.json())
      .then(data => console.log("Spotify Profile:", data));
  }
});

