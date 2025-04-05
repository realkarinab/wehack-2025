const SPOTIFY_CLIENT_ID = d320778d84384745a25c942836dc6b86;
const SPOTIFY_SCOPES = 'user-read-private user-read-email';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'spotifyAuth') {
    authenticateSpotify(sendResponse);
    return true;
  }
});

function authenticateSpotify(callback) {
  const redirectUrl = `https://${chrome.runtime.id}.chromiumapp.org/`;
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('redirect_uri', redirectUrl);
  authUrl.searchParams.append('scope', SPOTIFY_SCOPES);

  chrome.identity.launchWebAuthFlow(
    { url: authUrl.href, interactive: true },
    (responseUrl) => {
      if (chrome.runtime.lastError || !responseUrl) {
        callback({ error: 'Authentication failed' });
        return;
      }
      
      const hash = new URL(responseUrl).hash.substring(1);
      const params = new URLSearchParams(hash);
      callback({
        accessToken: params.get('access_token'),
        expiresIn: params.get('expires_in')
      });
    }
  );
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Trip Down Melody Lane installed.");
});
