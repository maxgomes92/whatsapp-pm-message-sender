function saveTemplates (templates) {
  localStorage.setItem('templates', JSON.stringify(templates))
}

function getTemplates () {
  return JSON.parse(localStorage.getItem('templates') || '{}')
}

function saveTemplate (template) {
  const templates = getTemplates()
  templates[template.id] = template
  saveTemplates(templates)
}

function getTemplate (id) {
  const templates = getTemplates()
  return templates[id]
}

function deleteTemplate (id) {
  const templates = getTemplates()
  delete templates[id]
  saveTemplates(templates)
}

let wppTab
function setupListeners () {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url === 'https://web.whatsapp.com/' && tab.status === 'complete') {
      chrome.pageAction.show(tabId);
    }
  });

  chrome.runtime.onMessage.addListener((request = {}, sender, sendResponse) => {
    console.log('onMessage', request)

    switch (request.type) {
      case 'SAVE_TEMPLATE':
        saveTemplate(request.payload)
        sendResponse({ success: true })
        break
      case 'GET_TEMPLATE':
        sendResponse({ success: true, payload: getTemplate(request.payload.id) })
        break
      case 'GET_TEMPLATES':
        sendResponse({ success: true, payload: getTemplates() })
        break
      case 'DELETE_TEMPLATE':
        deleteTemplate(request.payload.id)
        break
      case 'REGISTER_WPP_TAB':
        wppTab = sender.tab
        break
      case 'SEND_MESSAGE':
        chrome.tabs.sendMessage(wppTab.id, request);
      case 'LOAD_CONTACTS':
        chrome.tabs.sendMessage(wppTab.id, request)
        break
      default:
        console.warn('Invalid or not handled message')
    }
  });
}

setupListeners()
