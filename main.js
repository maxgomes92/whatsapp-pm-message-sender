function main () {
  setupListeners()
}

function setupListeners() {
  chrome.runtime.onMessage.addListener((request = {}, sender, sendResponse) => {
    switch (request.type) {
      case 'SEND_MESSAGE':
        sendMessageFromTemplate(request.payload)
        break
      case 'LOAD_CONTACTS':
        fetchAndSaveContacts()
        break
      default:
        console.warn('Invalid or unhandled message')
    }
  })

  chrome.runtime.sendMessage({type: "REGISTER_WPP_TAB"});
}

async function sendMessageFromTemplate (template) {
  for(let contact of template.contacts) {
    const {contactName, contactData} = contact
    const message = Object.entries(contactData).reduce((acc, [key, value]) => {
      return acc.replace(new RegExp(`\\${key}`, 'g'), value)
    }, template.message)

    await sendMessageTo(contactName, message)
  }
}

function save (key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function load (key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

const waitFor = (time) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, time)
})

const fetchAndSaveContacts = async () => {
  const paneSide = await getPaneSide()
  const chatList = Array.from((await getChatList()).children)

  const scrollingStep = (chatList[0].clientHeight * chatList.length) * 0.5

  const contacts = new Set()

  await scrollPaneSideToTop()

  do {
    chatList.forEach((chatEl) => {
      const titleEl = chatEl.querySelector('span[title]')
      contacts.add(titleEl.getAttribute('title'))
    })

    paneSide.scrollTop += scrollingStep;
    await waitFor(100)
  } while ((paneSide.scrollTop + paneSide.offsetHeight) < (paneSide.scrollHeight - 50))

  paneSide.scrollTop = 0

  saveContacts(Array.from(contacts).sort())
}

function saveContacts (contacts) {
  chrome.runtime.sendMessage({type: "SAVE_CONTACTS", payload: contacts});
}

const getMessageInputEl = () => waitUntilYouFind('div[spellcheck="true"]')
const getSendButton = () => waitUntilYouFind('span[data-testid="send"]')
const getSearchInput = () => waitUntilYouFind('div[id="side"] div[contenteditable="true"]')
const getPaneSide = () => waitUntilYouFind('#pane-side')
const getChatList = () => waitUntilYouFind('[id="pane-side"] [role="grid"]')

const setMessage = async (msg) => {
  const msgEl = await getMessageInputEl()
  setTextContent(msgEl, msg)
}

const setTextContent = (el, msg) => {
  el.textContent = msg
  el.dispatchEvent(new InputEvent('input', { bubbles: true}))
}

const sendMessage = async () => {
  const sendButton = await getSendButton()
  sendButton.click()
}

async function openChat (name) {
  const el = await getChatEl(name)
  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
  await scrollPaneSideToTop()
}

async function scrollPaneSideToTop () {
  const paneSide = await getPaneSide()
  paneSide.scrollTop = 0
}

async function getChatEl (name) {
  const getEl = (title) => document.querySelector(`span[title="${title}"]`)

  const paneSide = await getPaneSide()
  const chatList = Array.from((await getChatList()).children)

  const scrollingStep = (chatList[0].clientHeight * chatList.length) * 0.5

  await scrollPaneSideToTop()

  do {
    const chatEl = getEl(name)

    if (chatEl) {
      return chatEl
    }

    paneSide.scrollTop += scrollingStep;
    await waitFor(100)
  } while ((paneSide.scrollTop + paneSide.offsetHeight) < (paneSide.scrollHeight - 50))

  throw new Error('Can\'t find contact' + name)
}

const sendMessageTo = async (name, message) => {
  await openChat(name)
  await setMessage(message)
  await sendMessage()
}

main()
