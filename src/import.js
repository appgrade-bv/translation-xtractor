const { readFile, writeFile, parseJSON } = require('./utils')

function doImport(argv) {
  const csv = readFile(argv.input)
  const lines = csv.split(/[\n\r]/g)
  const regex = new RegExp(`("[^"]+")|([^${argv.delimiter}]+)`, 'gi')

  const translationMap = {}
  const existingTranslationMap = {}
  let languages = []

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
    const key = `${groups[0]}.${groups[1]}`

    if (groups.length !== languages.length + 2) {
      throw new Error(`Found a missing translation for key "${key}".`)
    }

    groups.slice(2).forEach((translation, splitIndex) => {
      translationMap[languages[splitIndex]][key] = translation.replace(/"/g, '')
    })
  })

  languages.forEach(lang => {
    if (argv.merge) {
      try {
        const content = readFile(`${argv.output}/${lang}.json`)
        existingTranslationMap[lang] = parseJSON(content)

        Object.keys(existingTranslationMap[lang]).forEach(existingTranslationKey => {
          if (!translationMap[lang].hasOwnProperty(existingTranslationKey)) {
            translationMap[lang][existingTranslationKey] = existingTranslationMap[lang][existingTranslationKey]
          }
        })
      }
      catch (e) {
        console.error(`Could not merge with file ${argv.output}/${lang}.json:`)
        console.error(e)
      }
    }

    writeFile(`${argv.output}/${lang}.json`, JSON.stringify(translationMap[lang], null, 2)
    )
  })

  console.info(`Translations have been imported to ${argv.output}.`)
}

module.exports = doImport
