const fs = require('fs')
const path = require('path')

const { DELIMITER_CHAR, NEW_LINE } = require('./constants')

function getFileNameWithoutExtension(filename) {
  return path.parse(filename).name
}

function doExport(argv) {
  const input = Array.isArray(argv.input) ? argv.input : [argv.input]
  let languages = []

  const translationMap = input.reduce((map, filePath) => {
    const lang = getFileNameWithoutExtension(filePath)
    const content = fs.readFileSync(filePath, 'utf8')
    map[lang] = JSON.parse(content)

    languages.push(lang)
    return map
  }, {})

  // Create header
  let csv = `Component${DELIMITER_CHAR}Field name`
  languages.forEach(lang => csv += `${DELIMITER_CHAR}${lang}`)
  csv += NEW_LINE

  // Write rows of translations for every language
  Object.keys(translationMap[languages[0]]).forEach(key => {
    const pos = key.lastIndexOf('.')
    const component = key.substring(0, pos)
    const fieldName = key.substring(pos + 1)

    const translation = languages.reduce((acc, curr) => {
      acc[curr] = translationMap[curr][key]
      return acc
    }, {})

    csv += `${component}${DELIMITER_CHAR}${fieldName}`

    languages.forEach(lang => csv += `${DELIMITER_CHAR}${translation[lang]}`)
    csv += NEW_LINE
  })

  fs.writeFileSync(argv.output, csv, 'utf8')
}

module.exports = doExport
