// background.js

// Function to fetch and copy Authorization header
async function fetchAndCopyAuthorizationHeader() {
  // Fetch the current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Use webRequest API to capture headers
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      // Find the Authorization header
      let authorizationHeader = details.requestHeaders.find(header => header.name.toLowerCase() === 'authorization');

      if (authorizationHeader) {
        // Copy Authorization header value to clipboard
        let authHeaderValue = authorizationHeader.value;
        
        navigator.clipboard.writeText(authHeaderValue)
          .then(() => {
            console.log('Authorization header value copied to clipboard:', authHeaderValue);
          })
          .catch(err => {
            console.error('Failed to copy Authorization header value to clipboard:', err);
          });
      } else {
        console.warn('Authorization header not found in the request.');
      }

      // Remove listener after headers are fetched (optional)
      chrome.webRequest.onBeforeSendHeaders.removeListener(arguments.callee);
    },
    { urls: ["<all_urls>"], tabId: tab.id },
    ["requestHeaders"]
  );
}

// Call the function to fetch and copy Authorization header when the extension is installed or updated
chrome.runtime.onInstalled.addListener(fetchAndCopyAuthorizationHeader);