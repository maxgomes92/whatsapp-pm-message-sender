

function main () {
  setupListeners()
  loadListOfTemplates()
}

async function loadListOfTemplates () {
  const templates = await getTemplates()

  const listOfTemplatesEl = document.getElementById('list-of-templates')

  Object.values(templates).forEach((template) => {
    const templateTemplate = document.importNode(document.getElementById('template').content, true);
    const templateEl = templateTemplate.querySelector('[data-cid="template-item"]')

    templateEl.querySelector('[data-cid="template-title"]').innerText = template.title
    templateEl.querySelector('[data-cid="template-number-of-contacts"]').innerText = template.contacts.length

    const limit = 200
    const message = template.message.slice(0, limit)
    templateEl.querySelector('[data-cid="template-message"]').innerText = message.length === limit ? message + '...' : message

    templateEl.addEventListener('click', () => {
      renderTemplate(template)
    })

    listOfTemplatesEl.appendChild(templateEl)
  })
}

function renderTemplate (template) {
  // Hide/Show
  document.getElementById('templates-list').style.display = 'none'
  document.getElementById('template-details').style.display = 'flex'

  // Change content
  document.querySelector('[id="template-details"] [data-cid="template-title"]').innerText = template.title
  document.querySelector('[id="template-details"] [data-cid="template-message"]').innerText = template.message
}

function getTemplates () {
  return new Promise ((resolve) => {
    chrome.runtime.sendMessage({type: "GET_TEMPLATES"}, ({ payload }) => {
      resolve(payload)
    });
  })
}

function createTemplate () {
  chrome.tabs.create({ url: chrome.runtime.getURL("templates.html") });
}

function setupListeners () {
  document.getElementById("btn-create").addEventListener("click", createTemplate);
}

main()
