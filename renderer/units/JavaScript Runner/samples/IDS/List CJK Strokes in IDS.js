// List CJK Strokes in IDS
const { characters } = require ('./units/CJK Components/parsed-ids-data.js');
const { characterToCodePoint } = require ('./lib/unicode/unicode.js');
let strokeList = [ ];
for (let character in characters)
{
    let { sequences } = characters[character];
    for (let sequence of sequences)
    {
        let strokes = sequence.ids.match (/([㇀-㇣])/gu);
        if (strokes)
        {
            strokeList.push (...strokes);
        }
    }
}
let uniqueStrokes = [...new Set (strokeList)].sort ();
$.writeln ("Count:", uniqueStrokes.length);
for (let stroke of uniqueStrokes)
{
    $.writeln (characterToCodePoint (stroke), stroke);
}
