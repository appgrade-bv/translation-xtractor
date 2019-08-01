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

module.exports = {
  readFile,
  writeFile,
  parseJSON,
}
