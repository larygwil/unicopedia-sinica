//
// https://www.unicode.org/reports/tr38/
//
const fs = require ('fs');
const path = require ('path');
//
// Copy of https://www.unicode.org/Public/UNIDATA/CJKRadicals.txt
//
// # This data file provides a mapping from the CJK radical numbers used
// # in the kRSUnicode property to the corresponding character in
// # the Kangxi Radicals block or the CJK Radicals Supplement block,
// # as well as to a CJK unified ideograph which is formed from that
// # radical only.
//
let radicalsData = { };
//
let lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'CJKRadicals.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let fields = line.split (";");
        let radicalNumber = fields[0].trim ();
        let radicalCharacter = fields[1].trim ();
        let unifiedCharacter = fields[2].trim ();
        radicalsData[radicalNumber] = { radicalCharacter, unifiedCharacter };
    }
}
//
module.exports = radicalsData;
//
