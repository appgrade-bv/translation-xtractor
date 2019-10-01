#!/usr/bin/env node

const yargs = require('yargs')

const { DELIMITER_CHAR } = require('../src/constants')

const doExport = require('../src/export')
const doImport = require('../src/import')

try {
  yargs
    .command(
      'export',
      'Export the specified JSON translation files to CSV.',
      (yargs) => {
        return yargs
          .option('input', {
            alias: 'i',
            describe: 'The path to the input translation file(s); can be specified multiple times.',
            demandOption: true,
          })
          .option('output', {
            alias: 'o',
            describe: 'The path to the output file.',
            demandOption: false,
            default: 'output.csv',
          })
          .option('delimiter', {
            alias: 'd',
            describe: 'The delimiter to use to separate values',
            demandOption: false,
            default: DELIMITER_CHAR,
          })
      },
      (argv) => doExport(argv))
    .command(
      'import',
      'Import the specified CSV translation file to one or more JSON files.',
      (yargs) => {
        return yargs
          .option('input', {
            alias: 'i',
            describe: 'The path to the input translation file.',
            demandOption: true,
          })
          .option('output', {
            alias: 'o',
            describe: 'The path where the JSON file(s) will be written to.',
            demandOption: false,
            default: './',
          })
          .option('delimiter', {
            alias: 'd',
            describe: 'The delimiter used to separate values',
            demandOption: false,
            default: DELIMITER_CHAR,
          })
      },
      (argv) => doImport(argv))
  .command(
      'update',
      'Import the specified CSV translation file to one or more JSON files.',
      (yargs) => {
        return yargs
          .option('input', {
            alias: 'i',
            describe: 'The path to the input translation file.',
            demandOption: true,
          })
          .option('output', {
            alias: 'o',
            describe: 'The path where the JSON file(s) will be written to.',
            demandOption: false,
            default: './',
          })
          .option('delimiter', {
            alias: 'd',
            describe: 'The delimiter used to separate values',
            demandOption: false,
            default: DELIMITER_CHAR,
          })
      },
      (argv) => doUpdate(argv))
    .argv
} catch (error) {
  console.error('Oops! Something did not go as planned:')
  console.error(`* ${error.message || error}`)
}
