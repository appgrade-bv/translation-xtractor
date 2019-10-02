const { writeFile, readFromCSV, readFromExistingTranslations } = require('./utils');

function updateTranslations(fromCSV, appTranslationMap, output) {
    fromCSV.languages.forEach(lang => {
        for (const property in fromCSV.translationMap[lang]) {
            if (fromCSV.translationMap[lang].hasOwnProperty(property)) {
                appTranslationMap[lang][property] = fromCSV.translationMap[lang][property];
            }
        }
        writeFile(`${output}/${lang}.json`, JSON.stringify(appTranslationMap[lang], null, 2));
    });
}

function doUpdate(argv) {
    const fromCSV = readFromCSV(argv.input, argv.delimiter);
    const appTranslationMap = readFromExistingTranslations(argv.output, fromCSV.languages);
    updateTranslations(fromCSV, appTranslationMap, argv.output);
    console.info(`Translations have been updated in ${argv.output}.`);
}

module.exports = doUpdate;