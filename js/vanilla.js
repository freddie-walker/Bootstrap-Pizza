/**
 * Liefert das 1. HTMLElement oder <null>, welches der <query> entspricht,
 * @param query - CSS-Selektor als String
 * @returns {HTMLElement} - das 1. gefundene Element
 */
const $ = query => document.querySelector(query)
const $$ = query => Array.from(document.querySelectorAll(query))

/**
 * Bindet einen Event-Handler (=Funktion) an ein DOM-Element
 * @param element - das Ziel-Element, z.B. Button
 * @param event - das Event, z.B. 'click'
 * @param func - die aufzurufende Funktion, z.B. handleValidation
 * @returns {*} - das Ziel-Element
 */
const $on = (element, event, func) => {
  Array.isArray(element)
    ? element.forEach(arrayElement => $on(arrayElement, event, func))
    : element.addEventListener(event, func)
  return element
}

/**
 * Durchläuft das HTML-Dokument und rendert sämtliche Handlebars-Script-Tags
 * @param data - die zu rendernden Daten
 * @returns {Promise<void>}
 */
const render = async (data) => {
  const templates = $$('[type="text/x-handlebars-template"]')

  for (const source of templates) {
    await loadPartials(source)
    const template = Handlebars.compile(source.innerHTML)
    const target = source.parentElement
    target.insertAdjacentHTML('beforeend', template(data))
  }
}

/**
 * Lädt Partials mit der Datei-Endung '.html' aus dem gleichen Verzeichnis
 * @param code - der zu parsende Source-Code
 * @returns {Promise<void>}
 */
async function loadPartials(code) {
  const partialNames = code.innerText.match(/(?<={{(#>|>)).+?(?=\s)/g)
  if (partialNames) {
    for (let name of partialNames) {
      name = name.trim()
      const fileName = name + '.html'
      const partialCode = await fetch(fileName).then(response => response.text())
      Handlebars.registerPartial(name, partialCode)
    }
  }
}

const PIZZA_KEY = "selectedPizzas"



