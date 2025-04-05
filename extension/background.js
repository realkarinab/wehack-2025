// background.js
const CLIENT_ID = 'd320778d84384745a25c942836dc6b86';
const REDIRECT_URI = chrome.identity.getRedirectURL('spotify');
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=$$${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private user-read-email playlist-read-private`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authenticate') {
    chrome.identity.launchWebAuthFlow(
      {
        url: AUTH_URL,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }
        const url = new URL(redirectUrl);
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
          chrome.storage.local.set({ accessToken: accessToken }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ error: 'Failed to retrieve access token.' });
        }
      }
    );
    return true; // Indicate asynchronous response
  }
  if (request.action === 'getAccessToken') {
    chrome.storage.local.get('accessToken', (data) => {
      sendResponse({ accessToken: data.accessToken });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Trip Down Melody Lane installed.");
});