document.getElementById("btn-create").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("templates.html") });
});
