const path = require('path')

const { NEW_LINE } = require('./constants')
const { readFile, writeFile, parseJSON } = require('./utils')

function getFileNameWithoutExtension(filename) {
  return path.parse(filename).name
}

function doExport(argv) {
  const input = Array.isArray(argv.input) ? argv.input : [argv.input]
  let languages = []

  const translationMap = input.reduce((map, filePath) => {
    const lang = getFileNameWithoutExtension(filePath)
    const content = readFile(filePath)

    map[lang] = parseJSON(content)

    languages.push(lang)
    return map
  }, {})

  // Create header
  let csv = `Component${argv.delimiter}Field name`
  languages.forEach(lang => csv += `${argv.delimiter}${lang}`)
  csv += NEW_LINE

  // Write rows of translations for every language
  Object.keys(translationMap[languages[0]]).forEach(key => {
    const pos = key.lastIndexOf('.')
    const component = key.substring(0, pos)
    const fieldName = key.substring(pos + 1)

    const translations = languages.reduce((acc, curr) => {
      acc[curr] = translationMap[curr][key]
      return acc
    }, {})

    csv += `${component}${argv.delimiter}${fieldName}`

    languages.forEach(lang => {
      let translation = translations[lang]
      if (translation.includes(argv.delimiter)) {
        translation = `"${translation}"`
      }

      csv += `${argv.delimiter}${translation}`
    })

    csv += NEW_LINE
  })

  writeFile(argv.output, csv)
}

module.exports = doExport
