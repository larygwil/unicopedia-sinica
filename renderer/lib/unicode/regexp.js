//
// Temporary until Electron framework adds built-in support for Unicode 14.0
// const rewritePattern = require ('regexpu-core');
//
// Support for Unicode 14.0 finally added in Electron 17.0.0 (2022-02-01) (Chromium 98)
const rewritePattern = null;
//
function build (pattern, options)
{
    if (!options)
    {
        options = { };
    }
    let flags = 'u';
    if (!options.caseSensitive)
    {
         flags += 'i';
    }
    if (options.global)
    {
         flags += 'g';
    }
    if (!options.useRegex)
    {
         pattern = Array.from (pattern, (char) => `\\u{${char.codePointAt (0).toString (16)}}`).join ('');
    }
    if (options.wholeWord)
    {
        const beforeWordBoundary = '(?<![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        const afterWordBoundary = '(?![\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}])';
        pattern = `${beforeWordBoundary}(?:${pattern})${afterWordBoundary}`;
    }
    if (rewritePattern)
    {
        pattern = rewritePattern (pattern, flags, { unicodePropertyEscapes: 'transform' });
    }
    return new RegExp (pattern, flags);
};
//
const assignedPattern = '^\\p{Assigned}$';
const assignedRegex = build (assignedPattern, { useRegex: true });
//
function isAssigned (character)
{
    return assignedRegex.test (character);
}
//
const unihanPattern = '^(?:(?=\\p{Script=Han})(?=\\p{Other_Letter}).)$';
const unihanRegex = build (unihanPattern, { useRegex: true });
//
function isUnihan (character)
{
    return unihanRegex.test (character);
}
//
const unifiedPattern = '^\\p{Unified_Ideograph}$';
const unifiedRegex = build (unifiedPattern, { useRegex: true });
//
function isUnified (character)
{
    return unifiedRegex.test (character);
}
//
function isCompatibility (character)
{
    return isUnihan (character) && (!isUnified (character));
}
//
// Cannot use \p{Variation_Selector} since it also includes Mongolian Free Variation Selectors
const unihanVariationPattern = '^\\p{Unified_Ideograph}[\\u{FE00}-\\u{FE0F}\\u{E0100}-\\u{E01EF}]$';
const unihanVariationRegex = build (unihanVariationPattern, { useRegex: true });

function isUnihanVariation (string)
{
    return unihanVariationRegex.test (string);
}
//
const radicalPattern = '^\\p{Radical}$';
const radicalRegex = build (radicalPattern, { useRegex: true });
//
function isRadical (character)
{
    return radicalRegex.test (character);
}
//
module.exports =
{
    build,
    isAssigned,
    isUnihan,
    isUnified,
    isCompatibility,
    isUnihanVariation,
    isRadical
};
//
