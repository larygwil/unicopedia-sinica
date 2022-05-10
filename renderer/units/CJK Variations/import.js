//
const unit = document.getElementById ('cjk-variations-unit');
//
const historyButton = unit.querySelector ('.history-button');
const unihanInput = unit.querySelector ('.unihan-input');
const lookUpButton = unit.querySelector ('.look-up-button');
const characterReference = unit.querySelector ('.character-reference');
const ivsGlyphsContainer = unit.querySelector ('.ivs-glyphs-container');
const instructions = unit.querySelector ('.instructions');
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
const unihanHistorySize = 128;   // 0: unlimited
//
let unihanHistory = [ ];
let unihanHistoryIndex = -1;
let unihanHistorySave = null;
//
let currentUnihanCharacter;
//
module.exports.start = function (context)
{
    const { clipboard, shell } = require ('electron');
    const { app, getCurrentWindow, Menu } = require ('@electron/remote');
    //
    const currentWindow = getCurrentWindow ();
    //
    const fs = require ('fs');
    const path = require ('path');
    //
    const userDataPath = app.getPath ('userData');
    const svgDataPath = path.join (userDataPath, 'svg-glyphs-2020');
    //
    const pullDownMenus = require ('../../lib/pull-down-menus.js');
    const linksList = require ('../../lib/links-list.js');
    //
    const regexp = require ('../../lib/unicode/regexp.js');
    const unicode = require ('../../lib/unicode/unicode.js');
    const unihan = require ('../../lib/unicode/unihan.js');
    //
    const refLinks = require ('./ref-links.json');
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        instructions: true,
        references: false,
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    let { collections, sequences } = require ('../../lib/unicode/parsed-ivd-sequences.js');
    //
    const { collections: bsCollections, sequences: bsSequences } = require ('./unregistered/ivd-data-bs.json');
    //
    collections = Object.assign (collections, bsCollections);
    //
    for (let bsSequence in bsSequences)
    {
        if (bsSequence in sequences)
        {
            sequences[bsSequence] = [...sequences[bsSequence], ...bsSequences[bsSequence]];
        }
        else
        {
            sequences[bsSequence] = bsSequences[bsSequence];
        }
    }
    //
    const collectionNames = Object.keys (collections).sort ((a, b) => a.localeCompare (b));
    //
    const pages = require ('./svg-pages-2020.json');
    //
    const bsPages = require ('./unregistered/svg-pages-bs.json');
    //
    function getSequenceRange (collection, ivs)
    {
        let result = null;
        let [ base, vs ] = ivs;
        let value = (base.codePointAt (0) * (2**24)) + vs.codePointAt (0);
        let collectionPages = (collection === "BabelStone") ? bsPages : pages[collection];
        for (let page of collectionPages)
        {
            let firstValue = (page.first[0] * (2**24)) + page.first[1];
            let lastValue = (page.last[0] * (2**24)) + page.last[1];
            if ((value >= firstValue) && (value <= lastValue))
            {
                result = { collection, range: page.range, page: page.page };
                break;
            }
        }
        return result;
    }
    //
    let parser = new DOMParser ();
    //
    function getIvsDataURL (svgFilePath, ivs)
    {
        let svg = fs.readFileSync (svgFilePath, 'utf8');
        let doc = parser.parseFromString (svg, 'text/xml');
        let dataURL = doc.getElementById (ivs).querySelector ('image').getAttribute ('href');
        return dataURL;
    }
    //
    let currentDiffElement = null;
    let currentAlternateDiff;
    //
    function showDifferences (event)
    {
        if (!(event.button || event.ctrlKey || event.metaKey))
        {
            event.preventDefault ();
            let diffElement = event.currentTarget;
            if (diffElement.dataset.svgPath && fs.existsSync (diffElement.dataset.svgPath))
            {
                let alternateDiff = event.altKey || event.shiftKey;
                let glyphs;
                if (alternateDiff)
                {
                    glyphs = diffElement.closest ('.table').querySelectorAll (`.glyph[data-ivs="${diffElement.dataset.ivs}"]`);
                }
                else
                {
                    glyphs = diffElement.closest ('.row').querySelectorAll ('.glyph');
                }
                if (glyphs.length > 1) // Diff needs at least two elements to compare
                {
                    let currentBackground = diffElement.querySelector ('.background');
                    for (let glyph of glyphs)
                    {
                        let background = glyph.querySelector ('.background');
                        let overlay = glyph.querySelector ('.overlay');
                        if (background !== currentBackground)
                        {
                            let img = new Image ();
                            img.className = 'img-glyph';
                            img.src = getIvsDataURL (diffElement.dataset.svgPath, diffElement.dataset.ivs);
                            overlay.appendChild (img);
                            background.classList.remove ('shown');
                            overlay.classList.add ('shown');
                        }
                    }
                    currentDiffElement = diffElement;
                    currentAlternateDiff = alternateDiff;
                    document.addEventListener ('mouseup', hideDifferences, { once: true });
                }
                else
                {
                    currentDiffElement = null;
                }
            }
        }
    }
    //
    function hideDifferences (event)
    {
        if (currentDiffElement)
        {
            event.preventDefault ();
            let glyphs;
            let currentBackground = currentDiffElement.querySelector ('.background');
            if (currentAlternateDiff)
            {
                glyphs = currentDiffElement.closest ('.table').querySelectorAll (`.glyph[data-ivs="${currentDiffElement.dataset.ivs}"]`);
            }
            else
            {
                glyphs = currentDiffElement.closest ('.row').querySelectorAll ('.glyph');
            }
            for (let glyph of glyphs)
            {
                let background = glyph.querySelector ('.background');
                let overlay = glyph.querySelector ('.overlay');
                if (background !== currentBackground)
                {
                    background.classList.add ('shown');
                    overlay.classList.remove ('shown');
                    while (overlay.firstChild)
                    {
                        overlay.firstChild.remove ();
                    }
                }
            }
            currentDiffElement = null;
        }
    }
    //
    let currentIvs;
    //
    let ivsMenuTemplate =
    [
        { label: "Copy IVS", click: (menuItem) => clipboard.writeText (currentIvs) }
    ];
    let ivsContextualMenu = Menu.buildFromTemplate (ivsMenuTemplate);
    //
    function showIVSMenu (event)
    {
        event.preventDefault ();
        currentIvs = event.currentTarget.dataset.ivs;
        ivsContextualMenu.popup ({ window: currentWindow });
    }
    //
    const displayMode = 'horizontal';   // 'horizontal', 'vertical'
    const orderedVS = false; // Improve terminology!! collapse?? compact?
    const mergeSharedIVS = false;
    const hideIdentifiers = true;   // In header?
    const captionStyle = 'vs-code-point';    // 'full-code-point', 'vs-code-point', 'vs-number', 'vs-both'
    //
    function getSvgPath (collection, range)
    {
        let svgPath = "";
        if (collection === "BabelStone")
        {
            svgPath = path.join (__dirname, 'unregistered', collection, `${range}.svg`);
        }
        else if (fs.existsSync (svgDataPath))
        {
            svgPath = path.join (svgDataPath, collection, `${range}.svg`);
        }
        return svgPath;
    }

    function createGlyphsList (unihanCharacter)
    {
        let list = document.createElement ('div');
        list.className = 'glyph-list';
        if (unihanCharacter in sequences)
        {
            let table = document.createElement ('table');
            table.className = 'table';
            let first = true;
            for (let collection of collectionNames)
            {
                let collectionSequences = [ ];
                for (let sequence of sequences[unihanCharacter])
                {
                    if (sequence.collection === collection)
                    {
                        collectionSequences.push ({ ivs: sequence.ivs, identifier: sequence.identifier });
                    }
                }
                if (collectionSequences.length > 0)
                {
                    if (!first)
                    {
                        let emptyRow = document.createElement ('tr');
                        emptyRow.className = 'empty-row';
                        table.appendChild (emptyRow);
                    }
                    first = false;
                    let row = document.createElement ('tr');
                    row.className = 'row';
                    let collectionHeader = document.createElement ('th');
                    collectionHeader.className = 'collection-header';
                    collectionHeader.textContent = `${collection} Collection`;
                    collectionHeader.title = `Count: ${collectionSequences.length}`;
                    if (collection === "BabelStone")
                    {
                        let unregistered = document.createElement ('div');
                        unregistered.className = 'unregistered';
                        unregistered.textContent = "(UNREGISTERED)";
                        collectionHeader.appendChild (unregistered);
                    }
                    row.appendChild (collectionHeader);
                    for (let collectionSequence of collectionSequences)
                    {
                        let data = document.createElement ('td');
                        data.className = 'data';
                        let glyph = document.createElement ('div');
                        glyph.className = 'glyph';
                        let ivs = collectionSequence.ivs;
                        glyph.dataset.ivs = ivs;
                        glyph.addEventListener ('contextmenu', showIVSMenu);
                        let background = document.createElement ('div');
                        background.className = 'background';
                        background.classList.add ('shown');
                        let range = getSequenceRange (collection, ivs);
                        let svgPath = getSvgPath (collection, range.range);
                        if (svgPath)
                        {
                            glyph.dataset.svgPath = svgPath;
                            glyph.addEventListener ('mousedown', showDifferences);
                            const xmlns = "http://www.w3.org/2000/svg";
                            let svg = document.createElementNS (xmlns, 'svg');
                            svg.setAttributeNS (null, 'class', 'svg-glyph');
                            let use = document.createElementNS (xmlns, 'use');
                            use.setAttributeNS (null, 'href', `${svgPath}#${ivs}`);
                            svg.appendChild (use);
                            background.appendChild (svg);
                            if (collection === "BabelStone")
                            {
                                glyph.title = `https://www.babelstone.co.uk/Fonts/BSH_IVS.html`;
                            }
                            else
                            {
                                glyph.title = `IVD_Charts_${collection}.pdf\n#page=${range.page}`;
                            }
                        }
                        else
                        {
                            // Display PDF chart file name followed by page number (URL-like)
                            let pdfInfo = document.createElement ('div');
                            pdfInfo.className = 'pdf-info';
                            pdfInfo.appendChild (document.createTextNode ("IVD_Charts_"));
                            let wbr = document.createElement ('wbr');
                            pdfInfo.appendChild (wbr);
                            pdfInfo.appendChild (document.createTextNode (`${collection}.pdf`));
                            let wbr2 = document.createElement ('wbr');
                            pdfInfo.appendChild (wbr2);
                            pdfInfo.appendChild (document.createTextNode (`#page=${range.page}`));
                            background.appendChild (pdfInfo);
                        }
                        glyph.appendChild (background);
                        let overlay = document.createElement ('div');
                        overlay.className = 'overlay';
                        glyph.appendChild (overlay);
                        data.appendChild (glyph);
                        let caption = document.createElement ('div');
                        caption.className = 'caption';
                        let [ base, vs ] = ivs;
                        let vsCode = vs.codePointAt (0);
                        let vsNumber = (vsCode >= 0xE0100 ? vsCode - 0xE0100 + 16: vsCode - 0xFE00) + 1;
                        switch (captionStyle)
                        {
                            case 'full-code-point':
                                data.classList.add ('two-line-caption');
                                caption.textContent = unicode.characterToCodePoint (base) + " " + unicode.characterToCodePoint (vs);
                                break;
                            case 'vs-code-point':
                                caption.textContent = unicode.characterToCodePoint (vs);
                                caption.title = `VARIATION SELECTOR-${vsNumber} (VS${vsNumber})`;
                                break;
                            case 'vs-number':
                                caption.textContent = `(VS${vsNumber})`;
                                break;
                            case 'vs-both':
                                data.classList.add ('two-line-caption');
                                caption.appendChild (document.createTextNode (unicode.characterToCodePoint (vs)));
                                let br = document.createElement ('br');
                                caption.appendChild (br);
                                caption.appendChild (document.createTextNode (`(VS${vsNumber})`));
                                break;
                        }
                        data.appendChild (caption);
                        row.appendChild (data);
                    }
                    row.appendChild (collectionHeader.cloneNode (true));
                    table.appendChild (row);
                }
            }
            list.appendChild (table);
        }
        return list;
    }
    //
    function displayLookUpData (unihanCharacter)
    {
        while (ivsGlyphsContainer.firstChild)
        {
            ivsGlyphsContainer.firstChild.remove ();
        }
        ivsGlyphsContainer.scrollLeft = 0;
        currentUnihanCharacter = unihanCharacter;
        if (unihanCharacter)
        {
            let indexOfUnihanCharacter = unihanHistory.indexOf (unihanCharacter);
            if (indexOfUnihanCharacter !== -1)
            {
                unihanHistory.splice (indexOfUnihanCharacter, 1);
            }
            unihanHistory.unshift (unihanCharacter);
            if ((unihanHistorySize > 0) && (unihanHistory.length > unihanHistorySize))
            {
                unihanHistory.pop ();
            }
            unihanHistoryIndex = -1;
            unihanHistorySave = null;
            //
            if (unihanCharacter in sequences)
            {
                ivsGlyphsContainer.appendChild (createGlyphsList (unihanCharacter));
            }
            else
            {
                let message = document.createElement ('span');
                message.className = 'message';
                message.textContent = "No registered IVS...";
                ivsGlyphsContainer.appendChild (message);
            }
        }
    }
    //
    const characterOrCodePointRegex = /^\s*(?:(.)[\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]?|(?:[Uu]\+?)?([0-9a-fA-F]{4,5}))\s*$/u;
    //
    function validateUnihanCharacter (inputString)
    {
        let character = "";
        let match = inputString.match (characterOrCodePointRegex);
        if (match)
        {
            if (match[1])
            {
                character = match[1];
            }
            else if (match[2])
            {
                character = String.fromCodePoint (parseInt (match[2], 16));
            }
            if (!regexp.isUnified (character))
            {
                character = "";
            }
        }
        return character;
    }
    //
    unihanInput.addEventListener
    (
        'input',
        (event) =>
        {
            event.currentTarget.classList.remove ('invalid');
            if (event.currentTarget.value)
            {
                if (!validateUnihanCharacter (event.currentTarget.value))
                {
                    event.currentTarget.classList.add ('invalid');
                }
            }
        }
    );
    unihanInput.addEventListener
    (
        'keypress',
        (event) =>
        {
            if (event.key === 'Enter')
            {
                event.preventDefault ();
                lookUpButton.click ();
            }
        }
    );
    unihanInput.addEventListener
    (
        'keydown',
        (event) =>
        {
            if (event.altKey)
            {
                if (event.key === 'ArrowUp')
                {
                    event.preventDefault ();
                    if (unihanHistoryIndex === -1)
                    {
                        unihanHistorySave = event.currentTarget.value;
                    }
                    unihanHistoryIndex++;
                    if (unihanHistoryIndex > (unihanHistory.length - 1))
                    {
                        unihanHistoryIndex = (unihanHistory.length - 1);
                    }
                    if (unihanHistoryIndex !== -1)
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
                else if (event.key === 'ArrowDown')
                {
                    event.preventDefault ();
                    unihanHistoryIndex--;
                    if (unihanHistoryIndex < -1)
                    {
                        unihanHistoryIndex = -1;
                        unihanHistorySave = null;
                    }
                    if (unihanHistoryIndex === -1)
                    {
                        if (unihanHistorySave !== null)
                        {
                            event.currentTarget.value = unihanHistorySave;
                            event.currentTarget.dispatchEvent (new Event ('input'));
                        }
                    }
                    else
                    {
                        event.currentTarget.value = unihanHistory[unihanHistoryIndex];
                        event.currentTarget.dispatchEvent (new Event ('input'));
                    }
                }
            }
        }
    );
    //
    function updateUnihanData (character)
    {
        while (characterReference.firstChild)
        {
            characterReference.firstChild.remove ();
        }
        if (character)
        {
            let characterInfo = document.createElement ('span');
            characterInfo.className = 'character-info';
            let [ base, vs ] = character;   // Might allow IVS input in the future...
            let baseCharacter = document.createElement ('span');
            baseCharacter.className = 'base-character';
            let characterGlyph = document.createElement ('span');
            characterGlyph.className = 'character-glyph';
            characterGlyph.textContent = base;
            baseCharacter.appendChild (characterGlyph);
            let characterCodePoint = document.createElement ('span');
            characterCodePoint.className = 'character-code-point';
            if (regexp.isCompatibility (base))
            {
                characterCodePoint.classList.add ('compatibility');
            }
            characterCodePoint.textContent = unicode.characterToCodePoint (base);
            baseCharacter.title = unihan.getTooltip (base);
            baseCharacter.appendChild (characterCodePoint);
            characterInfo.appendChild (baseCharacter);
            if (vs)
            {
                let plusJoiner = document.createElement ('span');
                plusJoiner.className = 'plus-joiner';
                plusJoiner.textContent = "+";
                characterInfo.appendChild (plusJoiner);
                let vsCharacter = document.createElement ('span');
                vsCharacter.className = 'vs-character';
                let characterGlyph = document.createElement ('span');
                characterGlyph.className = 'character-glyph';
                let vsCode = vs.codePointAt (0);
                let vsNumber = (vsCode >= 0xE0100 ? vsCode - 0xE0100 + 16: vsCode - 0xFE00) + 1;
                characterGlyph.appendChild (document.createTextNode ("VS"));
                characterGlyph.appendChild (document.createElement ('br'));
                characterGlyph.appendChild (document.createTextNode (vsNumber));
                vsCharacter.appendChild (characterGlyph);
                let characterCodePoint = document.createElement ('span');
                characterCodePoint.className = 'character-code-point';
                characterCodePoint.textContent = unicode.characterToCodePoint (vs);
                vsCharacter.appendChild (characterCodePoint);
                vsCharacter.title = `VARIATION SELECTOR-${vsNumber} (VS${vsNumber})`;
                characterInfo.appendChild (vsCharacter);
            }
            characterReference.appendChild (characterInfo);
        }
        unihanInput.value = "";
        unihanInput.blur ();
        unihanInput.dispatchEvent (new Event ('input'));
        displayLookUpData (character);
        unit.scrollTop = 0;
        unit.scrollLeft = 0;
    }
    //
    lookUpButton.addEventListener
    (
        'click',
        (event) =>
        {
            if (unihanInput.value)
            {
                let character = validateUnihanCharacter (unihanInput.value);
                if (character)
                {
                    updateUnihanData (character);
                }
                else
                {
                    shell.beep ();
                }
            }
            else
            {
                unihanHistoryIndex = -1;
                unihanHistorySave = null;
                updateUnihanData ("");
            }
        }
    );
    //
    const textSeparator = (process.platform === 'darwin') ? "\t" : "\xA0\xA0";
    //
    function insertUnihanCharacter (menuItem)
    {
        unihanInput.value = menuItem.id;
        unihanInput.dispatchEvent (new Event ('input'));
        lookUpButton.click ();
    };
    historyButton.addEventListener
    (
        'click',
        (event) =>
        {
            let historyMenuTemplate = [ ];
            historyMenuTemplate.push ({ label: "Lookup History", enabled: false })
            // historyMenuTemplate.push ({ type: 'separator' })
            if (unihanHistory.length > 0)
            {
                for (let unihan of unihanHistory)
                {
                    historyMenuTemplate.push
                    (
                        {
                            label: `${unihan}${textSeparator}${unicode.characterToCodePoint (unihan)}`,
                            id: unihan,
                            toolTip: unicode.getCharacterBasicData (unihan).name,
                            click: insertUnihanCharacter
                        }
                    );
                }
            }
            else
            {
                historyMenuTemplate.push ({ label: "(no history yet)", enabled: false });
            }
            let historyContextualMenu = Menu.buildFromTemplate (historyMenuTemplate);
            pullDownMenus.popup (event.currentTarget, historyContextualMenu, 0);
        }
    );
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
    //
    instructions.open = prefs.instructions;
    //
    references.open = prefs.references;
    //
    linksList (links, refLinks);
    //
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        unihanHistory: unihanHistory,
        unihanCharacter: currentUnihanCharacter,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
