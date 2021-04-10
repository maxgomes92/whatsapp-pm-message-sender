document.getElementById('btn-contact-add').addEventListener('click', (evt) => {
  const contactsList = document.getElementById('contacts-list')
  const contactCardTemplateFragment = document.getElementById('contact-card-template')
  const contactCardTemplate = document.importNode(contactCardTemplateFragment.content, true);
  const contactCard = contactCardTemplate.getElementById('contact-card')

  const removeButton = contactCard.querySelector('button')
  removeButton.addEventListener('click', () => {
    contactsList.removeChild(contactCard)
  })

  contactsList.appendChild(contactCard)
})
