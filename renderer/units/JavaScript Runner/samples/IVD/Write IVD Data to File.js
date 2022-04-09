// Write IVD Data to File
const { collections, sequences } = require ('./lib/unicode/parsed-ivd-sequences.js');
let jsonFile = $.save ($.stringify ({ collections, sequences }, null, 4), 'ivd-data.json');
$.writeln (`Wrote IVD data to JSON file:\n${jsonFile}`);
