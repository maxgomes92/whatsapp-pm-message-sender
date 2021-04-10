chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // if (tab.url === 'https://web.whatsapp.com/' && tab.status === 'complete') {
    chrome.pageAction.show(tabId);
  // }
});
