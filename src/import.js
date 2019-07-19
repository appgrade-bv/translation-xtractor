const fs = require('fs')
const { DELIMITER_CHAR } = require('./constants')

function doImport(argv) {
  const csv = fs.readFileSync(argv.input, 'utf8')
  const lines = csv.split(/[\n\r]/g)

  const translationMap = {}
  let languages = []

  const regex = /("[^"]+")|([^,]+)/g
  lines.forEach((line, index) => {
    if (!line.includes(DELIMITER_CHAR)) {
      return
    }

    if (index === 0) {
      languages = line.split(DELIMITER_CHAR).slice(2)
      languages.forEach(lang => translationMap[lang] = {})
      return
    }

    const groups = line.match(regex)
    const component = `${groups[0]}.${groups[1]}`

    groups.slice(2).forEach((translation, splitIndex) => {
      translationMap[languages[splitIndex]][component] = translation.replace(/"/g, '')
    })
  })

  languages.forEach(lang => {
    fs.writeFileSync(`${argv.output}/${lang}.json`, JSON.stringify(translationMap[lang], null, 2), 'utf8')
  })
}

module.exports = doImport
