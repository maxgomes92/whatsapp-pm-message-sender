const waitUntilYouFind = (selector) => new Promise ((resolve, reject) => {
  let el;

  const timeout = setTimeout(() => reject('Can\'t find ' + selector), 10050)

  const interval = setInterval(() => {
    el = document.querySelector(selector)
    if (el) {
      clearTimeout(timeout)
      clearInterval(interval)
      resolve(el)
    }
  }, 100)
})
