const getChatEl = (title) => document.querySelector(`span[title="${title}"]`)
const getMessageInputEl = () => document.querySelector('div[spellcheck=true]')
const getSendButton = () => document.querySelector('span[data-testid="send"]')

let obj = {
  charCode: 97,
  code: "KeyA",
  key: "a",
  keyCode: 97,
  type: "keypress",
  which: 97,
}

const setMessage = (msg) => {
  const msgEl = getMessageInputEl()

  msgEl.dispatchEvent(new KeyboardEvent("keypress", obj))

  // msgEl.textContent = msg
}

const sendMessage = () => {
  const sendButton = getSendButton()
  sendButton.click()
}

const openChat = (name) => {
  const el = getChatEl(name)

  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }))
}

const sendMessageTo = (name) => {
  openChat(name)

  setTimeout(() => {
    setMessage('salve do bot')
    sendMessage()
  }, 2000)
}


setTimeout(() => {
  sendMessageTo('Luan')
}, 5000)
