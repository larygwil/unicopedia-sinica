// Write IDS Data to File
const { characters } = require ('./lib/unicode/parsed-ids-data.js');
let jsonFile = $.save ($.stringify (characters, null, 4), 'ids-data.json');
$.writeln (`Wrote IDS data to JSON file:\n${jsonFile}`);
