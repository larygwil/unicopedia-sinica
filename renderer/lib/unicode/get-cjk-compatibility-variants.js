//
let compatibilityVariants = { };
const unihanCompatibilityBlocks =
[
    {
        "name": "CJK Compatibility Ideographs",
        "first": "F900",
        "last": "FAFF"
    },
    {
        "name": "CJK Compatibility Ideographs Supplement",
        "first": "2F800",
        "last": "2FA1F"
    }
];
unihanCompatibilityBlocks.forEach
(
    block =>
    {
        let firstIndex = parseInt (block.first, 16);
        let lastIndex = parseInt (block.last, 16);
        for (let index = firstIndex; index <= lastIndex; index++)
        {
            let character = String.fromCodePoint (index);
            let decomposition = character.normalize ('NFD');
            if (decomposition !== character)
            {
                if (!(decomposition in compatibilityVariants))
                {
                    compatibilityVariants[decomposition] = [ ];
                }
                compatibilityVariants[decomposition].push (character);
            }
        }
    }
);
//
module.exports = compatibilityVariants;
//
