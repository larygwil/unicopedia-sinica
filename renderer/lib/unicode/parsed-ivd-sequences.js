//
const fs = require ('fs');
const path = require ('path');
//
const unicode = require ('./unicode.js');
//
// https://www.unicode.org/reports/tr37/
//
// In IVD_Collections.txt, each line corresponds to an Ideographic Variation Collection, and there are three fields per line:
//     field 1: the identifier of a collection
//     field 2: a regular expression for the identifiers within the collection; all such identifiers must match that regular expression. Over time, this regular expression may be extended, as new identifiers are used in the collection.
//     field 3: the URL of a site describing the collection
//
// In IVD_Sequences.txt, each line corresponds to an Ideographic Variation Sequence and there are three fields per line:
//     field 1: the code points of the base character and the variation selector, separated by a space
//     field 2: the identifier of the collection under which the sequence is registered
//     field 3: the identifier of the sequence, provided by the registrant; this identifier must match the regular expression for the collection
//
let lines;
//
let collections = { };
//
// Copy of https://www.unicode.org/ivd/data/2020-11-06/IVD_Collections.txt
lines = fs.readFileSync (path.join (__dirname, 'IVD', 'IVD_Collections.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split (";").map (field => field.trim ());
        collections[fields[0]] = { pattern: fields[1], url: fields[2] };
    }
}
//
let regexes = { };
//
for (let collection in collections)
{
    regexes[collection] = new RegExp (`^${collections[collection].pattern}$`);
}
//
let sequences = { };
//
// Copy of https://www.unicode.org/ivd/data/2020-11-06/IVD_Sequences.txt
lines = fs.readFileSync (path.join (__dirname, 'IVD', 'IVD_Sequences.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split (";").map (field => field.trim ());
        let ivs = unicode.codePointsToCharacters (fields[0]);
        let [ base, vs ] = ivs;
        let collection = fields[1];
        let identifier = fields[2]; // Sequence identifier
        if (collection in collections)
        {
            if (!(base in sequences))
            {
                sequences[base] = [ ];
            }
            if (!regexes[collection].test (identifier))
            {
                console.log ("Invalid collection identifier:", collection, identifier);
            }
            sequences[base].push ({ ivs, collection, identifier });
        }
        else
        {
            console.log ("Line:", line);
            console.log ("Unknown collection:", collection);
            break;
        }
    }
}
//
module.exports = { collections , sequences };
//
