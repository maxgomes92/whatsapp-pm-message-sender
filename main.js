function main () {
  sendMessageTo('Andrei')
}

const getChatEl = (title) => waitUntilYouFind(`span[title="${title}"]`)
const getMessageInputEl = () => waitUntilYouFind('div[spellcheck="true"]')
const getSendButton = () => waitUntilYouFind('span[data-testid="send"]')

const setMessage = async (msg) => {
  const msgEl = await getMessageInputEl()

  msgEl.textContent = msg
  msgEl.dispatchEvent(new Event('input', { bubbles: true }))
}

const sendMessage = async () => {
  const sendButton = await getSendButton()
  sendButton.click()
}

const openChat = async (name) => {
  const el = await getChatEl(name)

  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
}

const sendMessageTo = async (name) => {
  await openChat(name)
  await setMessage('salve do bot')
  await sendMessage()
}

main()
