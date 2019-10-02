const fs = require('fs')
const path = require('path')

function readFile(filePath) {
  try {
    return content = fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    switch (error.code) {
      case 'ENOENT':
        throw new Error(`The specified file or directory does not exist: ${filePath}.`)

      case 'EACCES':
        throw new Error(`You have no rights to access the specified file or directory: ${filePath}`)

      default:
        throw error
    }
  }
}

function writeFile(filePath, content) {
  try {
    // Make sure the directories exist and, if not, create them.
    fs.mkdirSync(path.dirname(filePath), { recursive: true })

    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    switch (error.code) {
      case 'ENOENT':
        throw new Error(`The specified file or directory does not exist: ${filePath}.`)

      default:
        throw error
    }
  }
}

function parseJSON() {
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`The specified file is no valid JSON file: ${filePath}`)
  }
}


function readFromCSV(file, delimiter) {
  const csv = readFile(file);
  const lines = csv.split(/[\n\r]/g);

  const translationMap = {};
  let languages = [];

  const regex = new RegExp(`("[^"]+")|([^${delimiter}]+)`, 'gi');
  lines.forEach((line, index) => {
      if (!line.includes(delimiter)) {
          return;
      }

      if (index === 0) {
          languages = line.split(delimiter).slice(2);
          languages.forEach(lang => translationMap[lang] = {});
          return;
      }

      const groups = line.match(regex);
      const key = `${groups[0]}.${groups[1]}`;

      if (groups.length !== languages.length + 2) {
          throw new Error(`Found a missing translation for key "${key}".`);
      }

      groups.slice(2).forEach((translation, splitIndex) => {
          translationMap[languages[splitIndex]][key] = translation.replace(/"/g, '');
      });
  });
  return { translationMap: translationMap, languages: languages };
}


function readFromExistingTranslations(location, languages) {
  return languages.reduce((map, lang) => {
      const content = readFile(location + lang + '.json');
      map[lang] = parseJSON(content);
      return map;
  }, {});
}

module.exports = {
  readFile,
  writeFile,
  parseJSON,
  readFromCSV,
  readFromExistingTranslations
};
