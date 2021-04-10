const template = {
  id: getRandomId(),
  title: 'Template zica',
  message: 'Fala $nome, você tem $idade anos.',
  contacts: [{
    contactName: 'joao',
    contactData: {
      nome: 'Joao da Agenda',
      idade: '23'
    }
  }]
}

function main () {

  setupForm()

  // Temp
  addNewContact()
  addNewContact()
  updateContactVariables()

  document.getElementById('btn-contact-add').addEventListener('click', () => {
    addNewContact()
    updateContactVariables()
  })
  document.getElementById('btn-submit').addEventListener('click', onSubmit)
  document.getElementById('btn-delete').addEventListener('click', onDelete)
  document.getElementById('message').addEventListener('focusout', updateContactVariables)

  document.querySelectorAll('input,textarea').forEach((el) => {
    el.addEventListener('focusout', hideInvalidFormBadge)
  })
}

function onDelete () {
  console.log('delete')
}

function isAnyEmpty (obj) {
  const verifyDataTypes = (value) => {
    if (!value) return true;

    if (Array.isArray(value)) {
      return value.some((el) => verifyDataTypes(el))
    }

    if (typeof value === 'object') {
      return isAnyEmpty(value)
    }

    return false
  }

  return Object.values(obj).some(verifyDataTypes)
}

const getInvalidFormBadgeEl = () => document.getElementById('badge-invalid-form')

const showInvalidFormBadge = () => {
  getInvalidFormBadgeEl().style.visibility = 'visible'
}

const hideInvalidFormBadge = () => {
  getInvalidFormBadgeEl().style.visibility = 'hidden'
}

function onSubmit () {
  const formData = getFormData()

  if (isAnyEmpty(formData)) {
    showInvalidFormBadge()
    return;
  }

  hideInvalidFormBadge()
  console.log('onSubmit', formData)

  // chrome.tabs.getCurrent(function(tab) {
  //   chrome.tabs.remove(tab.id);
  // });
}

function getFormData () {
  const contactsList = document.getElementById('contacts-list').childNodes

  const contacts = Array.from(contactsList).map((contactEl) => {
    const contactName = contactEl.querySelector('input[id^="contact-"]').value
    const contactData = getCurrentVariablesFromMessage().reduce((acc, cur) => {
      acc[cur] = contactEl.querySelector(`input[id^="${cur}_"]`).value
      return acc
    }, {})

    return {
      contactName,
      contactData,
    }
  }, {})


  return {
    title: document.getElementById('title').value,
    message: document.getElementById('message').value,
    contacts,
  }
}

function addNewContact () {
  const contactsList = document.getElementById('contacts-list')
  const contactCardTemplate = document.importNode(document.getElementById('contact-card-template').content, true);
  const contactCard = contactCardTemplate.getElementById('contact-card')

  const removeButton = contactCard.querySelector('button')
  removeButton.addEventListener('click', () => {
    contactsList.removeChild(contactCard)
  })

  contactsList.insertBefore(contactCard, contactsList.firstChild)
}

function getRandomId () {
  return Math.random().toString(32)
}

function getFormVariablesEl (variableName) {
  const formVariablesTemplate = document.importNode(document.getElementById('form-variables-template').content, true);
  const formVariablesEl = formVariablesTemplate.getElementById('form-variables')

  const inputId = `${variableName}_${getRandomId()}`

  formVariablesEl
    .querySelector('input')
    .setAttribute('id', inputId)

  formVariablesEl
    .querySelector('label')
    .innerHTML = variableName

  formVariablesEl
    .querySelector('label')
    .setAttribute('for', inputId)


  return formVariablesEl
}

function updateContactVariables () {
  const contactsListNodes = Array.from(document.getElementById('contacts-list').childNodes)
  const variables = getCurrentVariablesFromMessage()

  for (let node of contactsListNodes) {
    const formList = node.querySelector('#form-variables-list')

    Array.from(formList.childNodes).forEach(child => {
      if (!variables.includes(child.getAttribute('id'))) {
        formList.removeChild(child)
      }
    })

    for (let variable of variables) {
      if (!formList.querySelector(`input[id^="${variable}_"]`)) {
        formList.appendChild(getFormVariablesEl(variable))
      }
    }
  }
}

function getCurrentVariablesFromMessage () {
  const message = document.getElementById('message').value
  const regex = new RegExp(/\$\w+/g)
  const variables = []

  let match
  do {
    match = regex.exec(message)

    if (match && match[0]) {
      variables.push(match[0])
    }

  } while (match)

  return variables
}

function setupForm() {
  Object.entries(template).forEach(([key, value]) => {
    const el = document.getElementById(key)

    if (el) {
      el.value = value
    }
  });
}

main()
