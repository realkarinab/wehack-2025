const CLIENT_ID = d320778d84384745a25c942836dc6b86;
const REDIRECT_URI = chrome.identity.getRedirectURL("spotify");
const SCOPE = "user-read-playback-state user-modify-playback-state";
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&show_dialog=true`;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "spotify-auth") {
    chrome.identity.launchWebAuthFlow(
      {
        url: SPOTIFY_AUTH_URL,
        interactive: true,
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("Auth failed", chrome.runtime.lastError);
          return;
        }

        const params = new URLSearchParams(redirectUrl.split("#")[1]);
        const token = params.get("access_token");
        console.log("Spotify Access Token:", token);
      }
    );
  }
});
