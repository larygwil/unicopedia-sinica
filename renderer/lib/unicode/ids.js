//
// https://appsrv.cse.cuhk.edu.hk/~irg/irg/irg50/IRGN2310SC2N4611WG2N4979IRGPnP11.pdf
/*
Character Description Component (CDC): It refers to any symbols that can be used with the 
Ideograph Description Characters to form a Ideograph Description Sequence. It includes all coded 
CJK unified ideographs, Kangxi Radicals, CJK Radical Supplements, and coded CJK Compatibility 
ideographs.

Ideographic Description Characters (IDC): The 12 characters defined in ISO/IEC 10646 starting 
from the code point U+2FF0: ⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻.

Ideographic Description Sequence (IDS): IDS describes a character using its components and 
indicating the relative positions of the components. IDCs are considered operators to the components. 
IDSs can be expressed by a context free grammar through the Backus Naur Form (BNF). The 
grammar G has four components:
      
Let G = {Σ, N, P, S}, where
    • Σ: the set of terminal symbols including all coded radicals and coded ideographs (referred to
    as CDC, Character Description Components), and the 12 IDCs.
    • N: the set of 5 non-terminal symbols
        N = {IDS, IDS1, Binary_Symbol, Ternary_Symbol, CDC}
    • S = {IDS}, which is the start symbol of the grammar
    • P: a set of rewrite rules
The following is the set of rewriting rules P:
    • IDS ::= <Binary_Symbol><IDS1><IDS1> | <Ternary_Symbol><IDS1><IDS1><IDS1>
    • <IDS1> ::= <IDS> | <CDC>
    • <CDC>::= coded_ideograph | coded_radical | coded_component
    • <Binary_Symbol> ::= ⿰ | ⿱ | ⿴ | ⿵ | ⿶ | ⿷ | ⿸ | ⿹ | ⿺ | ⿻
    • <Ternary_Symbol> ::= ⿲ | ⿳

Note1: Even though the IDCs are terminal symbols, they are not part of the CDCs.
Note2: Other than the binary symbol ⿻ (embedment which indicate overlay of two components), 
all the other 11 IDCs takes the IDS components (either 2 or 3) in a specific order. 
*/
//
// https://en.wikipedia.org/wiki/Ideographic_Description_Characters_(Unicode_block)
/*
IDS := Ideographic | Radical | CJK_Stroke | Private Use | U+FF1F | IDS_BinaryOperator IDS IDS | IDS_TrinaryOperator IDS IDS IDS 
CJK_Stroke := U+31C0 | U+31C1 | ... | U+31E3 
IDS_BinaryOperator := U+2FF0 | U+2FF1 | U+2FF4 | U+2FF5 | U+2FF6 | U+2FF7 | U+2FF8 | U+2FF9 | U+2FFA | U+2FFB 
IDS_TrinaryOperator:= U+2FF2 | U+2FF3
*/
//
const operators =
{
    // Prefix operators
    "⿰": { name: "IDC Left to Right", arity: 2 },              // \p{IDS_Binary_Operator}
    "⿱": { name: "IDC Above to Below", arity: 2 },             // \p{IDS_Binary_Operator}
    "⿲": { name: "IDC Left to Middle and Right", arity: 3 },   // \p{IDS_Trinary_Operator}
    "⿳": { name: "IDC Above to Middle and Below", arity: 3 },  // \p{IDS_Trinary_Operator}
    "⿴": { name: "IDC Full Surround", arity: 2 },              // \p{IDS_Binary_Operator}
    "⿵": { name: "IDC Surround from Above", arity: 2 },        // \p{IDS_Binary_Operator}
    "⿶": { name: "IDC Surround from Below", arity: 2 },        // \p{IDS_Binary_Operator}
    "⿷": { name: "IDC Surround from Left", arity: 2 },         // \p{IDS_Binary_Operator}
    "⿸": { name: "IDC Surround from Upper Left", arity: 2 },   // \p{IDS_Binary_Operator}
    "⿹": { name: "IDC Surround from Upper Right", arity: 2 },  // \p{IDS_Binary_Operator}
    "⿺": { name: "IDC Surround from Lower Left", arity: 2 },   // \p{IDS_Binary_Operator}
    "⿻": { name: "IDC Overlaid", arity: 2 },                   // \p{IDS_Binary_Operator}
    "〾": { name: "Ideographic Variation Indicator", arity: 1 },
    "↔": { name: "Horizontal Mirror Operator", arity: 1, additional: true },
    // "↕": { name: "Vertical Mirror Operator", arity: 1, additional: true },
    "↷": { name: "180° Rotation Operator", arity: 1, additional: true },
    "⊖": { name: "Subtraction Operator", arity: 2, additional: true }
};
//
const regexp = require ('../../lib/unicode/regexp.js');
//
function isValidOperand (token)
{
    let isValid = 
    (
        (token === '？') // Fullwidth question mark, indicating an unrepresentable component
        ||
        (regexp.isUnified (token))   // CJK Unified Ideographs
        ||
        (/[\u2E80-\u2EF3]/.test (token))    // CJK Radicals Supplement
        ||
        (/[\u31C0-\u31E3]/.test (token))    // CJK Strokes
        ||
        (/[\uE000-\uF8FF]/.test (token))    // Private Use Area
    );
    return isValid;
}
//
function getTree (idsArray)
{
    let idsIndex = 0;
    function parseToken ()
    {
        let result = null;
        let token = idsArray[idsIndex++];
        if (token)
        {
            if (token in operators)
            {
                result = { };
                result.operator = token;
                result.operands = [ ];
                for (let index = 0; index < operators[token].arity; index++)
                {
                    result.operands[index] = parseToken ();
                }
            }
            else
            {
                result = token;
            }
        }
        return result;
    }
    return parseToken ();
};
//
function compare (idsArray)
{
    let idsIndex = 0;
    function parseToken ()
    {
        let result = null;
        let token = idsArray[idsIndex++];
        if (token)
        {
            if (token in operators)
            {
                result = { };
                result.operator = token;
                result.operands = [ ];
                for (let index = 0; index < operators[token].arity; index++)
                {
                    result.operands[index] = parseToken ();
                }
            }
            else
            {
                result = token;
            }
        }
        return result;
    }
    parseToken ();
    return idsArray.length - idsIndex;
};
//
module.exports = { operators, isValidOperand, getTree, compare }
//