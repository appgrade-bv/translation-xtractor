# Translation Xtractor

## Description
This package enables you to export your translation JSON file(s) to the CSV file format, which can
then be edited in a more user-friendly environment like Microsoft Excel or Google Spreadsheets. The
other way around is of course also supported. After making your edits in the CSV file, you can then
import this file again so that your application has got its translations updated, in the form of one
or multiple JSON files.

## Use case
Working on an application with internationalisation, someone needs to take care of the translations
used in the app. Often, this is someone with a less technical background and it would be nice to
present them a translation file which is easier to edit. In our case, we use Angular in combination
with [@ngx/translate](https://github.com/ngx-translate/core). This library reads translations from
one or more JSON files, one per language. For English, this file could look like this:

```
{
  "header.banner-text": "Hello",
  "login-component.username": "Username",
  "login-component.password": "Password",
  "footer-component.copyright": "Copyright"
}
```

And in French like this:

```
{
  "header.banner-text": "Bonjour",
  "login-component.username": "Utilisateur",
  "login-component.password": "Mot de passe",
  "footer-component.copyright": "Copyright"
}
```

This library then takes in the translation files and spits them out in a format a spreadsheet editor
can read. An example of this could look like the table below.

Note that the headers are the component's name and "feature" and the name of the language(s), which are retrieved from the file name(s).

| Component        | Field name  | en        | fr           |
|------------------|-------------|-----------|--------------|
| header           | banner-text | Welcome   | Bonjour      |
| login-component  | username    | Username  | Utilisateur  |
| login-component  | password    | Password  | Mot de passe |
| footer-component | copyright   | Copyright | Copyright    |

After the modifications are done, the CSV file is presented to this package and you get
your JSON files again.

## Installation
To install this package locally, run:

`npm i @appgrade/translation-xtractor`

You can then reference `translation-xtractor` from your npm scripts.

If you want to use it globally, pass the global flag:

`npm i -g @appgrade/translation-xtractor`

## How to use
### Export
To export your translation files to CSV, use the `export` command. You **have** to specify one or
more input files (with `--input` or `-i`) and you **can** specify the name and path of the output
file (with `--output` or `-o`). By default, this is `output.csv` in the current folder.

Some valid examples are:

`translation-xtractor export --input english.json`

`translation-xtractor export -i assets/english.json`

`translation-xtractor export -i english.json -i french.json -i spanish.json`

`translation-xtractor export -i english.json --output some-folder/my-file.csv`

### Import
To import the CSV file again, you can use the `import` command. You **have** to specify one input file (with `--input` or `-i`) and you **can** specify the path where the JSON files will be placed. By default, this is the current folder.

Some valid examples are:

`translation-xtractor import --input output.csv`

`translation-xtractor import -i some-folder/output.csv`

`translation-xtractor import -i some-folder/output.csv -o assets/i18n`


### Other options
#### `-delimiter`
_alias: `-d`_

You can specify the delimiter for both the `import` and `export` command. This defaults to `,` (comma).

## Found a bug? Got a suggestion?
Shoot! You can reach us at [info@appgrade.be](mailto:info@appgrade.be) or create an issue or pull request on our [GitHub](https://github.com/appgrade-bvba/translation-xtractor).

## Release notes

### 1.2.0
- Added merge functionality to retain new keys when importing.

### 1.1.1
- Added warnings and prevent crashes when translations keys are missing in some input files.

### 1.1.0
- Added the option to specify a delimiter used for both `export` and `import` commands.
- Added rudimentary error handling.

### 1.0.0
- Added support to handle cases where the delimiter char is present in the output. As this is a breaking change compared to the release before, it's a major version bump.

### 0.0.1
- Initial release
