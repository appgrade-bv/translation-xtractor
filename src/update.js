const path = require('path');
const { readFile, writeFile, parseJSON } = require('./utils');

function doUpdate(argv) {
    const csv = readFile(argv.input);
    const lines = csv.split(/[\n\r]/g);

    const csvTranslationMap = {};
    let languages = [];

    const regex = new RegExp(`("[^"]+")|([^${argv.delimiter}]+)`, 'gi');
    lines.forEach((line, index) => {
        if (!line.includes(argv.delimiter)) {
            return;
        }

        if (index === 0) {
            languages = line.split(argv.delimiter).slice(2);
            languages.forEach(lang => csvTranslationMap[lang] = {});
            return;
        }

        const groups = line.match(regex);
        const key = `${groups[0]}.${groups[1]}`;

        if (groups.length !== languages.length + 2) {
            throw new Error(`Found a missing translation for key "${key}".`);
        }

        groups.slice(2).forEach((translation, splitIndex) => {
            csvTranslationMap[languages[splitIndex]][key] = translation.replace(/"/g, '');
        });
    });

    // compare each translation with each file
    const appTranslationMap = languages.reduce((map, lang) => {
        const content = readFile('src/assets/i18n/' + lang + '.json');
        map[lang] = parseJSON(content);
        return map;
    }, {});

    languages.forEach(lang => {
        for (const property in csvTranslationMap[lang]) {
            if (csvTranslationMap[lang].hasOwnProperty(property)) {
                appTranslationMap[lang][property] = csvTranslationMap[lang][property];
            }
        }
        writeFile(`${argv.output}/${lang}.json`, JSON.stringify(appTranslationMap[lang], null, 2));
    });

    console.info(`Translations have been imported to ${argv.output}.`);
}

module.exports = doUpdate;
