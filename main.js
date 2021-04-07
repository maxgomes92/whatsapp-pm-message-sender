function main () {
  sendMessageTo('Luan')
}

const getChatEl = (title) => waitUntilYouFind(`span[title="${title}"]`)
const getMessageInputEl = () => waitUntilYouFind('div[spellcheck="true"]')
const getSendButton = () => waitUntilYouFind('span[data-testid="send"]')
const getSearchInput = () => waitUntilYouFind('div[id="side"] div[contenteditable="true"]')

const setMessage = async (msg) => {
  const msgEl = await getMessageInputEl()
  setTextContent(msgEl, msg)
}

const searchForContact = async (name) => {
  // TODO: Not typing
  const searchEl = await getSearchInput()
  setTextContent(searchEl, name)
}

const setTextContent = (el, msg) => {
  el.textContent = msg
  el.dispatchEvent(new InputEvent('input', { bubbles: true}))
}

const sendMessage = async () => {
  const sendButton = await getSendButton()
  sendButton.click()
}

const openChat = async (name) => {
  // await searchForContact(name)
  const el = await getChatEl(name)

  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
}

const sendMessageTo = async (name) => {
  await openChat(name)
  await setMessage('salve do bot')
  await sendMessage()
}

main()
