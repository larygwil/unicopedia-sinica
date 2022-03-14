// List IDS Indivisible Characters
const { characters } = require ('./lib/unicode/parsed-ids-data.js');
const { characterToCodePoint } = require ('./lib/unicode/unicode.js');
const { coreSet, core2020Set } = require ('./lib/unicode/parsed-unihan-data.js');
function getSet (codePoint)
{
    let set = "Full";
    if (coreSet.includes (codePoint))
    {
        set = "IICore";
    }
    else if (core2020Set.includes (codePoint))
    {
        set = "U-Core";
    }
    return set;
}
let indivisibleCharacters = [ ];
for (let character in characters)
{
    let { sequences } = characters[character];
    let codePoint = characterToCodePoint (character);
    for (let sequence of sequences)
    {
        if (sequence.ids === character)
        {
            indivisibleCharacters.push (`${codePoint}\t${character}\t${getSet (codePoint)}`);
            break;
        }
    }
}
$.writeln ("Count:", indivisibleCharacters.length);
$.writeln (indivisibleCharacters.join ("\n"));
