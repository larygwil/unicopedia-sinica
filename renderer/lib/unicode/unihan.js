//
const regexp = require ('./regexp.js');
const unicode = require ('./unicode.js');
const { codePoints } = require ('./parsed-unihan-data.js');
const getCompatibilitySource = require ('./get-cjk-compatibility-source.js');
//
function getTooltip (character)
{
    let data = unicode.getCharacterBasicData (character);
    let status = regexp.isCompatibility (character) ? "Compatibility Ideograph" : "Unified Ideograph";
    let source = regexp.isCompatibility (character) ? getCompatibilitySource (character) : "";
    let set = "Full Unihan";
    let tags = codePoints[data.codePoint];
    if ("kIICore" in tags)
    {
        set = "IICore";
    }
    else if ("kUnihanCore2020" in tags)
    {
        set = "Unihan Core (2020)";
    }
    let lines =
    [
        `Code Point: ${data.codePoint}`,
        `Block: ${data.blockName}`,
        `Age: Unicode ${data.age} (${data.ageDate})`,
        `Set: ${set}`,
        `Status: ${status}`
    ];
    if (source)
    {
        lines.push (`Source: ${source}`);
    }
    return lines.join ("\n");
}
//
module.exports =
{
    getTooltip
};
//
