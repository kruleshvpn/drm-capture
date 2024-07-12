// background.js

const tabIDs = {};

// Function to fetch and copy Authorization header value to clipboard
function fetchAndCopyAuthorizationHeader(tabId) {
  chrome.tabs.get(tabId, (details) => {
    const lic_headers = tabIDs[details.id]?.license_request[0]?.license_headers;
    if (!lic_headers) return;

    // Find the Authorization header and extract its value
    const authorizationHeader = lic_headers.find(header => header.name.toLowerCase() === 'authorization');
    if (!authorizationHeader) {
      console.warn('Authorization header not found in the request.');
      return;
    }

    const authorizationValue = authorizationHeader.value;

    // Copy Authorization header value to clipboard
    navigator.clipboard.writeText(authorizationValue)
      .then(() => {
        console.log('Authorization header value copied to clipboard:', authorizationValue);
        
        // Optionally, set badge and show alert/message
        chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000", tabId: details.id });
        chrome.browserAction.setBadgeText({ text: "📋", tabId: details.id });
        alert("Authorization header value has been copied to your clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy Authorization header value to clipboard:', err);
      });
  });
}

// Listener to capture request headers and trigger authorization copying
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (tabIDs[details.tabId]?.license_url === details.url && tabIDs[details.tabId]?.req_id === details.requestId) {
      tabIDs[details.tabId].license_request.push({ license_headers: details.requestHeaders });
      fetchAndCopyAuthorizationHeader(details.tabId);
    }
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
  ["requestHeaders", "blocking"]
);