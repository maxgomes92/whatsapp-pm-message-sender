// active: true
// audible: true
// autoDiscardable: true
// discarded: false
// favIconUrl: "https://web.whatsapp.com/img/favicon_c5088e888c97ad440a61d247596f88e5.png"
// groupId: -1
// height: 899
// highlighted: true
// id: 17
// incognito: false
// index: 0
// mutedInfo: {muted: false}
// pinned: true
// selected: true
// status: "loading"
// title: "WhatsApp"
// url: "https://web.whatsapp.com/"
// width: 1075
// windowId: 16

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // if (tab.url === 'https://web.whatsapp.com/' && tab.status === 'complete') {
    chrome.pageAction.show(tabId);
  // }
});
