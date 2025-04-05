console.log('Google Photos Scraper content script loaded');

// Function to extract data from Google Photos page
function scrapeGooglePhotosPage() {
  const data = {
    pageTitle: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    photoCount: 0,
    photos: []
  };
  
  // Find photo elements on the page
  // Note: These selectors will need to be updated based on Google Photos DOM structure
  const photoElements = document.querySelectorAll('[data-item-key]'); // This is just an example selector
  
  if (photoElements.length > 0) {
    photoElements.forEach(photo => {
      try {
        // Extract image details - these are examples and may need adjustment
        const photoObject = {
          id: photo.getAttribute('data-item-key') || '',
          alt: photo.querySelector('img')?.alt || '',
          src: photo.querySelector('img')?.src || '',
          timestamp: photo.querySelector('[data-timestamp]')?.getAttribute('data-timestamp') || '',
        };
        
        // Add any additional metadata available
        const metadataElem = photo.querySelector('.photo-metadata');
        if (metadataElem) {
          photoObject.metadata = metadataElem.textContent;
        }
        
        data.photos.push(photoObject);
      } catch (e) {
        console.error('Error extracting photo data:', e);
      }
    });
    
    data.photoCount = data.photos.length;
  }
  
  return data;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scrapeContent") {
    console.log('Scraping Google Photos content...');
    
    try {
      // Get data from the page
      const scrapedData = scrapeGooglePhotosPage();
      
      // Store the data via the background script
      chrome.runtime.sendMessage({
        action: "storeData", 
        data: scrapedData
      }, function(response) {
        // Send response back to popup
        sendResponse({
          success: true, 
          photoCount: scrapedData.photoCount,
          data: scrapedData
        });
      });
    } catch (error) {
      console.error('Scraping error:', error);
      sendResponse({
        success: false, 
        error: error.message
      });
    }
    
    return true; // Required for async sendResponse
  }
});