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

document.getElementById('spotify-login').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'spotifyAuth' }, (response) => {
    if (response.accessToken) {
      console.log('Authenticated with token:', response.accessToken);
      // Store token and make API requests
    }
  });
});
