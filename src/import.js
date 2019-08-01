const { readFile, writeFile } = require('./utils')

function doImport(argv) {
  const csv = readFile(argv.input)
  const lines = csv.split(/[\n\r]/g)

  const translationMap = {}
  let languages = []

  const regex = new RegExp(`("[^"]+")|([^${argv.delimiter}]+)`, 'gi')
  lines.forEach((line, index) => {
    if (!line.includes(argv.delimiter)) {
      return
    }

    if (index === 0) {
      languages = line.split(argv.delimiter).slice(2)
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
    writeFile(`${argv.output}/${lang}.json`, JSON.stringify(translationMap[lang], null, 2))
  })

}

module.exports = doImport
