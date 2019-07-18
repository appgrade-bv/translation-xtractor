#!/usr/bin/env node

const yargs = require('yargs')

const doExport = require('../src/export')
const doImport = require('../src/import')

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
    },
    (argv) => doImport(argv))
  .argv
