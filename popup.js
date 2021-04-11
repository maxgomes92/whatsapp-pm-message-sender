

function main () {
  setupListeners()
  loadListOfTemplates()
}

async function loadListOfTemplates () {
  const templates = await getTemplates()

  console.log(templates, 'ae')

  const listOfTemplatesEl = document.getElementById('list-of-templates')
  Object.values(templates).forEach((template) => {
    // listOfTemplatesEl.appendChild(template.id)
  })
}

function getTemplates () {
  return new Promise ((resolve) => {
    chrome.runtime.sendMessage({type: "GET_TEMPLATES"}, ({ payload }) => {
      resolve(payload)
    });
  })
}

function setupListeners () {
  document.getElementById("btn-create").addEventListener("click", () => {
    const url = chrome.runtime.getURL("templates.html") + `?id=123456`
    chrome.tabs.create({ url });
  });
}

main()
