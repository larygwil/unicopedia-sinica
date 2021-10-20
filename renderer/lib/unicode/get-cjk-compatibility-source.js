
//
// https://www.unicode.org/Public/UNIDATA/NamesList.txt
// https://www.unicode.org/charts/PDF/UF900.pdf
// https://www.unicode.org/charts/PDF/U2F800.pdf
//
const compatibilitySources =
[
    {
        "source": "Pronunciation variants from KS X 1001:1998",
        "first": "F900",
        "last": "FA0B"
    },
    {
        "source": "Duplicate characters from Big 5",
        "first": "FA0C",
        "last": "FA0D"
    },
    {
        "source": "The IBM 32 compatibility ideographs",
        "first": "FA0E",
        "last": "FA2D"
    },
    {
        "source": "Korean compatibility ideographs",
        "first": "FA2E",
        "last": "FA2F"
    },
    {
        "source": "JIS X 0213 compatibility ideographs",
        "first": "FA30",
        "last": "FA6A"
    },
    {
        "source": "ARIB compatibility ideographs",
        "first": "FA6B",
        "last": "FA6D"
    },
    {
        "source": "DPRK compatibility ideographs",
        "first": "FA70",
        "last": "FAD9"
    },
    {
        "source": "Duplicate characters from CNS 11643-1992",
        "first": "2F800",
        "last": "2FA1D"
    }
];
//
for (let compatibilitySource of compatibilitySources)
{
    compatibilitySource["regex"] = new RegExp (`^[\\u{${compatibilitySource.first}}-\\u{${compatibilitySource.last}}]$`, 'u');
}
//
function getSource (character)
{
    let source = "";
    for (let compatibilitySource of compatibilitySources)
    {
        if (compatibilitySource.regex.test (character))
        {
            source = compatibilitySource.source;
            break;
        }
    }
    return source;
}
//
module.exports = getSource
//