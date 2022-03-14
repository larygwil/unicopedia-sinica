// List IDS Unrepresentable Characters
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
let unrepresentableCharacters = [ ];
for (let character in characters)
{
    let { sequences } = characters[character];
    let codePoint = characterToCodePoint (character);
    for (let sequence of sequences)
    {
        if (/？/u.test (sequence.ids))
        {
            unrepresentableCharacters.push ({ character, ids: sequence.ids, set: getSet (codePoint) } );
        }
    }
}
$.writeln ("Please wait...");
setTimeout
(
    () =>
    {
        $.clear ();
        $.writeln ("Count:", unrepresentableCharacters.length);
        for (let character of unrepresentableCharacters)
        {
            $.writeln (`${characterToCodePoint (character.character)}\t${character.character}\t${character.set}\t${character.ids}`);
        }
    }
);
