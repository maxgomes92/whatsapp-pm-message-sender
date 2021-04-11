document.getElementById("btn-create").addEventListener("click", () => {
  const url = chrome.runtime.getURL("templates.html") + '?id=123456'

  chrome.tabs.create({ url });
});
