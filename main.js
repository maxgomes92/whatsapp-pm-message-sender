function main () {
  loadContacts()
  setupListeners()
}

function setupListeners() {
  chrome.runtime.onMessage.addListener((request = {}, sender, sendResponse) => {
    switch (request.type) {
      case 'SEND_MESSAGE':
        sendMessageFromTemplate(request.payload)
        break
      default:
        console.warn('Invalid or unhandled message')
    }
  })

  chrome.runtime.sendMessage({type: "REGISTER_WPP_TAB"});
}

function sendMessageFromTemplate (template) {
  for(let contact of template.contacts) {
    const {contactName, contactData} = contact
    const message = Object.entries(contactData).reduce((acc, [key, value]) => {
      return acc.replace(new RegExp(`\\${key}`, 'g'), value)
    }, template.message)

    sendMessageTo(contactName, message)
  }
}

async function loadContacts () {
  let contacts = load('contacts')

  if (!contacts) {
    contacts = await fetchAllContacts()
    save('contacts', contacts)
  }

  return contacts
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

const fetchAllContacts = async () => {
  const paneSide = await getPaneSide()
  const chatList = Array.from((await getChatList()).children)

  const scrollingStep = (chatList[0].clientHeight * chatList.length) * 0.5

  const contacts = new Set()

  do {
    paneSide.scrollTop += scrollingStep;

    await waitFor(100)

    chatList.forEach((chatEl) => {
      const titleEl = chatEl.querySelector('span[title]')
      contacts.add(titleEl.getAttribute('title'))
    })
  } while ((paneSide.scrollTop + paneSide.offsetHeight) !== paneSide.scrollHeight)

  paneSide.scrollTop = 0

  return Array.from(contacts).sort()
}

const getMessageInputEl = () => waitUntilYouFind('div[spellcheck="true"]')
const getSendButton = () => waitUntilYouFind('span[data-testid="send"]')
const getSearchInput = () => waitUntilYouFind('div[id="side"] div[contenteditable="true"]')
const getPaneSide = () => waitUntilYouFind('#pane-side')
const getChatList = () => waitUntilYouFind('div[aria-label="Chat list"]')

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
}

async function getChatEl (name) {
  const getEl = (title) => document.querySelector(`span[title="${title}"]`)

  const paneSide = await getPaneSide()
  const chatList = Array.from((await getChatList()).children)

  const scrollingStep = (chatList[0].clientHeight * chatList.length) * 0.5

  do {
    paneSide.scrollTop += scrollingStep;

    await waitFor(100)

    const chatEl = getEl(name)

    if (chatEl) {
      return chatEl
    }
  } while ((paneSide.scrollTop + paneSide.offsetHeight) !== paneSide.scrollHeight)

  throw new Error('Can\'t find contact' + name)
}

const sendMessageTo = async (name, message) => {
  await openChat(name)
  await setMessage(message)
  await sendMessage()
}

main()
