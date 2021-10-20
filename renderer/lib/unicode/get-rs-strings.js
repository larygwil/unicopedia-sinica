//
const kangxiRadicals = require ('./kangxi-radicals.json');
//
function fromRadical (index, simplified, verbose)
{
    let kangxiRadical = kangxiRadicals[index - 1];
    let name;
    let radical;
    if (simplified)
    {
        for (let cjk of kangxiRadical.cjk)
        {
            if (cjk.simplified)
            {
                name = cjk.name;
                radical = cjk.radical;
                break;
            }
        }
    }
    else
    {
        radical = kangxiRadical.radical;
        name = kangxiRadical.name;
    }
    return (verbose ? "Radical " : "") + `${index} ${radical} (${name})`;
};
//
function fromStrokes (strokes, verbose)
{
    return `${strokes}`+ (verbose ? " Stroke" + `${strokes > 1 ? "s": ""}` : ``);
};
//
function fromRSValue (rsValue, verbose)
{
    let [ index, residual ] = rsValue.split (".");
    let result =
    [
        `${fromRadical (parseInt (index), index.match (/'$/), verbose)}`,
        `${fromStrokes (parseInt (residual), verbose)}`
    ];
    return result;
};
//
function fromRadicalStrokes (strokes, verbose)
{
    return `${strokes}-Stroke` + (verbose ? " Radicals" : "");
};
//
module.exports =
{
    fromRadical,
    fromStrokes,
    fromRSValue,
    fromRadicalStrokes
};
//
