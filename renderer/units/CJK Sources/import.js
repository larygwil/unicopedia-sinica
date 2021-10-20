//
const unitId = 'cjk-sources-unit';
//
const unit = document.getElementById (unitId);
//
const clearButton = unit.querySelector ('.clear-button');
const charactersSamples = unit.querySelector ('.characters-samples');
const countInfo = unit.querySelector ('.count-info');
const countNumber = unit.querySelector ('.count-number');
const totalCountNumber = unit.querySelector ('.total-count-number');
const loadButton = unit.querySelector ('.load-button');
const saveButton = unit.querySelector ('.save-button');
const charactersInput = unit.querySelector ('.characters-input');
const codePointsInput = unit.querySelector ('.code-points-input');
const sheet = unit.querySelector ('.sheet');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
const instructions = unit.querySelector ('.instructions');
//
let defaultFolderPath;
//
module.exports.start = function (context)
{
    const { app } = require ('@electron/remote');
    const userDataPath = app.getPath ('userData');
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const sampleMenus = require ('../../lib/sample-menus.js');
    const fileDialogs = require ('../../lib/file-dialogs.js');
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const { codePoints } = require ('../../lib/unicode/parsed-unihan-data.js');
    const getCompatibilitySource = require ('../../lib/unicode/get-cjk-compatibility-source.js');
    //
    const refLinks = require ('./ref-links.json');
    //
    const defaultPrefs =
    {
        charactersInput: "",
        instructions: true,
        references: false,
        defaultFolderPath: context.defaultFolderPath
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    clearButton.addEventListener
    (
        'click',
        event =>
        {
            charactersInput.value = "";
            charactersInput.dispatchEvent (new Event ('input'));
            charactersInput.focus ();
        }
    );
    //
    const pages = require ('./svg-pages-14.0.json');
    //
    const samples = require ('./samples.json');
    //
    samples.push (null);    // Separator
    //
    const unifiedBlockNames =
    {
        "CJK Unified (URO)": "U4E00",
        "CJK Unified Extension A": "U3400",
        "CJK Unified Extension B": "U20000",
        "CJK Unified Extension C": "U2A700",
        "CJK Unified Extension D": "U2B740",
        "CJK Unified Extension E": "U2B820",
        "CJK Unified Extension F": "U2CEB0",
        "CJK Unified Extension G": "U30000"
    };
    //
    let unifiedRangeSamples = [ ];
    for (let blockName in unifiedBlockNames)
    {
        let blockRanges = [ ];
        for (page of pages)
        {
            if (page.block === unifiedBlockNames[blockName])
            {
                let characters = [ ];
                for (let value = page.first; value <= page.last; value++)
                {
                    characters.push (String.fromCodePoint (value));
                }
                blockRanges.push ({ label: page.range.replaceAll ("U", "U+"), string: characters.join ("") });
            }
        }
        unifiedRangeSamples.push ({ label: blockName, items: blockRanges });
    }
    //
    let misclassifiedSamples =
    [
        {
            "label": "CJK Unified (Misclassified)",
            "string": "﨎﨏﨑﨓﨔﨟﨡﨣﨤﨧﨨﨩"
        }
    ];
    //
    const compatibilityBlockNames =
    {
        "CJK Compatibility": "UF900",
        "CJK Compatibility Supplement": "U2F800"
    };
    //
    let compatibilityRangeSamples = [ ];
    for (let blockName in compatibilityBlockNames)
    {
        let blockRanges = [ ];
        for (page of pages)
        {
            if (page.block === compatibilityBlockNames[blockName])
            {
                let characters = [ ];
                for (let value = page.first; value <= page.last; value++)
                {
                    characters.push (String.fromCodePoint (value));
                }
                blockRanges.push ({ label: page.range.replaceAll ("U", "U+"), string: characters.join ("") });
            }
        }
        compatibilityRangeSamples.push ({ label: blockName, items: blockRanges });
    }
    //
    let charactersMenu = sampleMenus.makeMenu
    (
        [...samples, ...unifiedRangeSamples, ...misclassifiedSamples, ...compatibilityRangeSamples],
        (sample) =>
        {
            charactersInput.value = sample.string;
            charactersInput.dispatchEvent (new Event ('input'));
        }
    );
    //
    charactersSamples.addEventListener
    (
        'click',
        event =>
        {
            pullDownMenus.popup (event.currentTarget, charactersMenu);
        }
    );
    //
    defaultFolderPath = prefs.defaultFolderPath;
    //
    loadButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.loadTextFile
            (
                "Load text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                'utf8',
                (text, filePath) =>
                {
                    let maxLength = charactersInput.maxLength;
                    if (text.length > maxLength)
                    {
                        text = text.substring (0, maxLength);
                    }
                    charactersInput.value = text;
                    charactersInput.dispatchEvent (new Event ('input'));
                    defaultFolderPath = path.dirname (filePath);
                }
            );
        }
    );
    //
    saveButton.addEventListener
    (
        'click',
        event =>
        {
            fileDialogs.saveTextFile
            (
                "Save text file:",
                [ { name: "Text (*.txt)", extensions: [ 'txt' ] } ],
                defaultFolderPath,
                (filePath) =>
                {
                    defaultFolderPath = path.dirname (filePath);
                    return charactersInput.value;
                }
            );
        }
    );
    //
    function isSupported (character)
    {
        // return regexp.isUnified (character);
        return regexp.isUnihan (character);
    }
    //
    const simpleBlockNames =
    {
        "U+4E00..U+9FFF": "CJK Unified (URO)",
        "U+3400..U+4DBF": "CJK Unified Extension A",
        "U+20000..U+2A6DF": "CJK Unified Extension B",
        "U+2A700..U+2B73F": "CJK Unified Extension C",
        "U+2B740..U+2B81F": "CJK Unified Extension D",
        "U+2B820..U+2CEAF": "CJK Unified Extension E",
        "U+2CEB0..U+2EBEF": "CJK Unified Extension F",
        "U+30000..U+3134F": "CJK Unified Extension G",
        "U+F900..U+FAFF": "CJK Compatibility",
        "U+2F800..U+2FA1F": "CJK Compatibility Supplement"
    };
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
            `Block: ${simpleBlockNames[data.blockRange]}`,
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
    const sources =
    {
        "G":
        {
            property: "kIRG_GSource",
            source: "China",
            designation: "G",
            modifier: "🄖"
        },
        "H":
        {
            property: "kIRG_HSource",
            source: "Hong Kong",
            designation: "H",
            modifier: "🄗"
        },
        "M":
        {
            property: "kIRG_MSource",
            source: "Macao",
            designation: "M",
            modifier: "🄜"
        },
        "T":
        {
            property: "kIRG_TSource",
            source: "Taiwan",
            designation: "T",
            modifier: "🄣"
        },
        "J":
        {
            property: "kIRG_JSource",
            source: "Japan",
            designation: "J",
            modifier: "🄙"
        },
        "K":
        {
            property: "kIRG_KSource",
            source: "South Korea",
            designation: "K",
            modifier: "🄚"
        },
        "KP":
        {
            property: "kIRG_KPSource",
            source: "North Korea",
            designation: "P",
            modifier: "🄟"
        },
        "V":
        {
            property: "kIRG_VSource",
            source: "Vietnam",
            designation: "V",
            modifier: "🄥"
        },
        "SAT":
        {
            property: "kIRG_SSource",
            source: "SAT",
            designation: "S",
            modifier: "🄢"
        },
        "UK":
        {
            property: "kIRG_UKSource",
            source: "U.K.",
            designation: "B",
            modifier: "🄑"
        },
        "UTC":
        {
            property: "kIRG_USource",
            source: "UTC",
            designation: "U",
            modifier: "🄤"
        }
    };
    //
    const sortedPrefixes = Object.keys (sources).reverse ();
    //
    function toDesignation (string)
    {
        let designation = "";
        for (let prefix of sortedPrefixes)
        {
            if (string.startsWith (prefix))
            {
                designation = sources[prefix].designation;
                break;
            }
        }
        return designation;
    }
    //
    const showLocalRendering = true;
    //
    const useFooter = true;
    //
    function getBlockRange (character)
    {
        let result = null;
        let value = character.codePointAt (0);
        for (let page of pages)
        {
            if ((value >= page.first) && (value <= page.last))
            {
                result = { block: page.block, range: page.range, page: page.page };
                break;
            }
        }
        return result;
    }
    //
    function createSheet (unihanCharacters)
    {
        while (sheet.firstChild)
        {
            sheet.firstChild.remove ();
        }
        if (unihanCharacters.length > 0)
        {
            for (let prefix in sources)
            {
                let source = sources[prefix];
                let count = 0;
                for (let character of unihanCharacters)
                {
                    let codePoint = unicode.characterToCodePoint (character);
                    if (source.property)
                    {
                        if (source.property in codePoints[codePoint])
                        {
                            if (source.property === "kIRG_KPSource")
                            {
                                // KP Glyphs only available in Compat., Ext. C, Compat. Sup.
                                if (/[\u{F900}-\u{FAFF}\u{2A700}-\u{2B73F}\u{2F800}-\u{2FA1F}]/u.test (character))
                                {
                                    count++;
                                }
                            }
                            else
                            {
                                count++;
                            }
                        }
                    }
                }
                source.hidden = (count === 0);
            }
            let table = document.createElement ('table');
            table.className= 'table';
            let headerRow = document.createElement ('tr');
            if (showLocalRendering)
            {
                let localHeader = document.createElement ('th');
                localHeader.className = 'local';
                localHeader.textContent = "Local Font";   // "Local Glyph"
                localHeader.title = "Default local glyph rendering for reference";
                headerRow.appendChild (localHeader);
                let emptyGap = document.createElement ('th');
                emptyGap.className = 'empty-gap';
                emptyGap.textContent = "\xA0";
                headerRow.appendChild (emptyGap);
            }
            for (let prefix in sources)
            {
                let source = sources[prefix];
                if (!source.hidden)
                {
                    let sourceHeader = document.createElement ('th');
                    sourceHeader.className = 'source';
                    sourceHeader.textContent = (prefix === "UCS") ? source.source : `${prefix}-Source`;
                    sourceHeader.title = source.source;
                    headerRow.appendChild (sourceHeader);
                }
            }
            table.appendChild (headerRow);
            for (let character of unihanCharacters)
            {
                let dataRow = document.createElement ('tr');
                dataRow.className = 'data-row';
                if (regexp.isCompatibility (character))
                {
                    dataRow.classList.add ('compatibility');
                }
                if (showLocalRendering)
                {
                    let data = document.createElement ('td');
                    data.className = 'data';
                    let glyph = document.createElement ('div');
                    glyph.className = 'glyph';
                    let fontGlyph = document.createElement ('div');
                    fontGlyph.className = 'font-glyph';
                    fontGlyph.textContent = character;
                    fontGlyph.title = getTooltip (character);
                    let code = document.createElement ('div');
                    code.className = 'code-point';
                    let codePoint = unicode.characterToCodePoint (character);
                    code.textContent = codePoint;
                    glyph.appendChild (fontGlyph);
                    data.appendChild (glyph);
                    data.appendChild (code);
                    dataRow.appendChild (data);
                    let emptyGap = document.createElement ('td');
                    emptyGap.className = 'empty-gap';
                    emptyGap.textContent = "\xA0";
                    dataRow.appendChild (emptyGap);
                }
                for (let prefix in sources)
                {
                    let source = sources[prefix];
                    if (!source.hidden)
                    {
                        let data = document.createElement ('td');
                        data.className = 'data';
                        let glyph = document.createElement ('div');
                        glyph.className = 'glyph';
                        let code = document.createElement ('div');
                        code.className = 'code';
                        let codePoint = unicode.characterToCodePoint (character);
                        let sourceReference = null;
                        if (source.property in codePoints[codePoint])
                        {
                            if (source.property === "kIRG_KPSource")
                            {
                                // KP Glyphs only available in Compat., Ext. C, Compat. Sup.
                                if (/[\u{F900}-\u{FAFF}\u{2A700}-\u{2B73F}\u{2F800}-\u{2FA1F}]/u.test (character))
                                {
                                    sourceReference = codePoints[codePoint][source.property];
                                }
                            }
                            else
                            {
                                sourceReference = codePoints[codePoint][source.property];
                            }
                        }
                        if (sourceReference)
                        {
                            let { block, range, page } = getBlockRange (character);
                            let id = `${character}_${toDesignation (sourceReference)}`;
                            let svgFilePath = path.join (userDataPath, 'svg-glyphs-14.0', `${block}/${range}.svg`);
                            if (fs.existsSync (svgFilePath))
                            {
                                const xmlns = "http://www.w3.org/2000/svg";
                                let svg = document.createElementNS (xmlns, 'svg');
                                svg.setAttributeNS (null, 'class', 'svg-glyph');
                                let use = document.createElementNS (xmlns, 'use');
                                use.setAttributeNS (null, 'href', svgFilePath + `#${id}`);
                                svg.appendChild (use);
                                glyph.appendChild (svg);
                            }
                            else
                            {
                                // Display PDF chart file name followed by page number (URL-like)
                                let pdfInfo = document.createElement ('div');
                                pdfInfo.className = 'pdf-info';
                                let pdfName = document.createElement ('span');
                                pdfName.textContent = `${block}.pdf`
                                pdfInfo.appendChild (pdfName);
                                let wbr = document.createElement ('wbr');
                                pdfInfo.appendChild (wbr);
                                let pdfPage = document.createElement ('span');
                                pdfPage.textContent = `#page=${page}`
                                pdfInfo.appendChild (pdfPage);
                                glyph.appendChild (pdfInfo);
                            }
                            code.textContent = sourceReference;
                        }
                        else
                        {
                            data.classList.add ('empty');
                            glyph.textContent = "　";
                            code.textContent = "\xA0";
                        }
                        data.appendChild (glyph);
                        data.appendChild (code);
                        dataRow.appendChild (data);
                    }
                }
                table.appendChild (dataRow);
            }
            if (useFooter)
            {
                table.appendChild (headerRow.cloneNode (true));
            }
            sheet.appendChild (table);
        }
    }
    //
    let currentCharacters = "";
    //
    // Discard unsupported characters, or duplicate characters when modifier key pressed as well
    countInfo.addEventListener
    (
        'dblclick',
        event =>
        {
            if (event.altKey || event.shiftKey)
            {
                let uniqueCharacters = [...new Set (Array.from (charactersInput.value))].join ("");
                if (uniqueCharacters !== charactersInput.value)
                {
                    charactersInput.value = uniqueCharacters;
                    charactersInput.dispatchEvent (new Event ('input'));
                }
            }
            else
            {
                if (currentCharacters !== charactersInput.value)
                {
                    countNumber.textContent = Array.from (currentCharacters).length;
                    totalCountNumber.textContent = Array.from (currentCharacters).length;
                    charactersInput.value = currentCharacters;
                    codePointsInput.value = unicode.charactersToCodePoints (currentCharacters, true);
                }
            }
        }
    );
    //
    charactersInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = event.currentTarget.value;
            let characterArray = Array.from (characters);
            totalCountNumber.textContent = characterArray.length;
            codePointsInput.value = unicode.charactersToCodePoints (characters, true);
            let validCharacterArray = characterArray.filter (character => isSupported (character));
            countNumber.textContent = validCharacterArray.length;
            let validCharacters = validCharacterArray.join ("");
            if (validCharacters !== currentCharacters)
            {
                createSheet (validCharacters);
                currentCharacters = validCharacters;
            }
        }
    );
    charactersInput.value = prefs.charactersInput;
    charactersInput.dispatchEvent (new Event ('input'));
    //
    codePointsInput.addEventListener
    (
        'input',
        event =>
        {
            let characters = unicode.codePointsToCharacters (event.currentTarget.value);
            let characterArray = Array.from (characters);
            totalCountNumber.textContent = characterArray.length;
            charactersInput.value = characters;
            let validCharacterArray = characterArray.filter (character => isSupported (character));
            countNumber.textContent = validCharacterArray.length;
            let validCharacters = validCharacterArray.join ("");
            if (validCharacters !== currentCharacters)
            {
                createSheet (validCharacters);
                currentCharacters = validCharacters;
            }
        }
    );
    codePointsInput.addEventListener
    (
        'change',
        event =>
        {
            event.currentTarget.value = unicode.charactersToCodePoints (charactersInput.value, true);
        }
    );
   //
    instructions.open = prefs.instructions;
    //
    references.open = prefs.references;
    //
    linksList (links, refLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        charactersInput: charactersInput.value,
        instructions: instructions.open,
        references: references.open,
        defaultFolderPath: defaultFolderPath
    };
    context.setPrefs (prefs);
};
//
