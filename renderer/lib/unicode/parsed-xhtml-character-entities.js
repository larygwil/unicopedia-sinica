//
const fs = require ('fs');
const path = require ('path');
//
let characters = { };
//
// Copy of http://www.w3.org/TR/xhtml1/DTD/xhtml-lat1.ent
// Copy of http://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent
// Copy of http://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent
//
let filenames = [ 'xhtml-lat1.ent', 'xhtml-special.ent', 'xhtml-symbol.ent' ];
//
for (let filename of filenames)
{
    let lines = fs.readFileSync (path.join (__dirname, 'DTD', filename), { encoding: 'utf8' }).split (/\r?\n/);
    for (let line of lines)
    {
        if (line)
        {
            let found = line.match (/^<!ENTITY\s+(\w+)\s+"(?:&#38;|&)#(\d+);">.*$/);
            if (found)
            {
                characters[String.fromCodePoint (parseInt (found[2]))] = `&${found[1]};`;
            }
        }
    }
}
//
module.exports = characters;
//
