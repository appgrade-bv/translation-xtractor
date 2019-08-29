const path = require('path')

const { NEW_LINE } = require('./constants')
const { readFile, writeFile, parseJSON } = require('./utils')

function getFileNameWithoutExtension(filename) {
  return path.parse(filename).name
}

function doExport(argv) {
  const input = Array.isArray(argv.input) ? argv.input : [argv.input]
  let languages = []
  
  const translationKeys = new Set()

  const translationMap = input.reduce((map, filePath) => {
    const lang = getFileNameWithoutExtension(filePath)
    const content = readFile(filePath)

    map[lang] = parseJSON(content)
    languages.push(lang)

    Object.keys(map[lang]).forEach(key => {
      translationKeys.add(key)
    })

    return map
  }, {})

  const csvLines = []

  // Write rows of translations for every key and every language
  translationKeys.forEach(key => {
    const pos = key.lastIndexOf('.')
    const component = key.substring(0, pos)
    const fieldName = key.substring(pos + 1)

    const translations = languages.reduce((acc, curr) => {
      acc[curr] = translationMap[curr][key]
      return acc
    }, {})

    let csv = `${component}${argv.delimiter}${fieldName}`

    languages.forEach(lang => {
      let translation = translations[lang]
      if (!translation) {
        console.warn(`The key "${key}" is missing in the "${lang}" language file.`)
        translation = ''
      }

      if (translation.includes(argv.delimiter)) {
        translation = `"${translation}"`
      }

      csv += `${argv.delimiter}${translation}`
    })

    csvLines.push(csv)
  })

  csvLines.sort()

  // Prepend header
  let csvHeader = `Component${argv.delimiter}Field name`
  languages.forEach(lang => csvHeader += `${argv.delimiter}${lang}`)
  csvLines.unshift(csvHeader)

  writeFile(argv.output, csvLines.join(NEW_LINE))

  console.info(`Translations have been exported to ${argv.output}.`)
}

module.exports = doExport
