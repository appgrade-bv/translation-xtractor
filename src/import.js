const { writeFile, readFromCSV } = require('./utils');

function importTranslations(fromCSV, output) {
  fromCSV.languages.forEach(lang => {
      writeFile(`${output}/${lang}.json`, JSON.stringify(fromCSV.translationMap[lang], null, 2));
  });
}

function doImport(argv) {
  const fromCSV = readFromCSV(argv.input, argv.delimiter);
  importTranslations(fromCSV, argv.output);
  console.info(`Translations have been imported to ${argv.output}.`);
}

module.exports = doImport;
