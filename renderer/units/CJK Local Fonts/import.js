//
const unit = document.getElementById ('cjk-local-fonts-unit');
//
const historyButton = unit.querySelector ('.history-button');
const unihanInput = unit.querySelector ('.unihan-input');
const lookUpButton = unit.querySelector ('.look-up-button');
const compactLayoutCheckbox = unit.querySelector ('.compact-layout-checkbox');
const characterReference = unit.querySelector ('.character-reference');
const nameFilterInput = unit.querySelector ('.name-filter-input');
const filteredCountNumber = unit.querySelector ('.filtered-count-number');
const totalCountNumber = unit.querySelector ('.total-count-number');
const errorMessage = unit.querySelector ('.error-message');
const fontGlyphsContainer = unit.querySelector ('.font-glyphs-container');
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
    const { shell } = require ('electron');
    const { Menu } = require ('@electron/remote');
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
    const fontList = require ('font-list');
    //
    let localFonts = null;
    //
    const defaultPrefs =
    {
        unihanHistory: [ ],
        unihanCharacter: "",
        nameFilterInput: "",
        compactLayout: false,
        instructions: true,
        references: false,
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    unihanHistory = prefs.unihanHistory;
    //
    const defaultFontSize = 48;
    const defaultCanvasSize = 60;
    //
    let canvas = document.createElement ('canvas');
    canvas.width = defaultCanvasSize;
    canvas.height = defaultCanvasSize;
    let ctx = canvas.getContext ('2d', { alpha: false, desynchronized: true });
    //
    function getTextData (text)
    {
        ctx.fillStyle = "white";
        ctx.fillRect (0, 0, ctx.canvas.width, ctx.canvas.height);
        if (text)
        {
            let textMetrics = ctx.measureText (text);
            let actualWidth = textMetrics.actualBoundingBoxRight - textMetrics.actualBoundingBoxLeft;
            let actualHeight = textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;
            ctx.fillStyle = "black";
            ctx.fillText (text, (ctx.canvas.width - actualWidth) / 2, ctx.canvas.height - ((ctx.canvas.height - actualHeight) / 2));
        }
        return ctx.getImageData (0, 0, ctx.canvas.width, ctx.canvas.height).data;
    }
    //
    let currentDiffElement = null;
    //
    function showBase (event)
    {
        if (!(event.button || event.ctrlKey || event.metaKey))
        {
            if (event.altKey || event.shiftKey)
            {
                event.preventDefault ();
                currentDiffElement = event.currentTarget;
                let glyph = currentDiffElement.querySelector ('.glyph');
                let [ base ] = currentUnihanCharacter;
                glyph.textContent = base;
                currentDiffElement.classList.remove ('vs-difference');
                document.addEventListener ('mouseup', hideBase, { once: true });
            }
        }
    }
    //
    function hideBase (event)
    {
        if (currentDiffElement)
        {
            event.preventDefault ();
            let glyph = currentDiffElement.querySelector ('.glyph');
            glyph.textContent = currentUnihanCharacter;
            currentDiffElement.classList.add ('vs-difference');
            currentDiffElement = null;
        }
    }
    //
    async function displayLookUpData (unihanCharacter)
    {
        while (fontGlyphsContainer.firstChild)
        {
            fontGlyphsContainer.firstChild.remove ();
        }
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
            let list = document.createElement ('div');
            list.className = 'glyph-list';
            if (!localFonts)
            {
                try
                {
                    localFonts = await fontList.getFonts ({ disableQuoting: true });
                }
                catch (e)
                {
                    console.log (e);
                }
            }
            if (localFonts)
            {
                for (let localFont of localFonts)
                {
                    ctx.font = `${defaultFontSize}px "${localFont}", "Blank"`;
                    let textMetrics = ctx.measureText (unihanCharacter);
                    let actualWidth = textMetrics.actualBoundingBoxRight - textMetrics.actualBoundingBoxLeft;
                    if (actualWidth > 0)
                    {
                        ctx.font = `${defaultFontSize}px "${localFont}"`;
                        let card =  document.createElement ('span');
                        card.className = 'card';
                        let [ base, vs ] = unihanCharacter;
                        if (vs)
                        {
                            if (getTextData (unihanCharacter).toString () !== getTextData (base).toString ())
                            {
                                card.classList.add ('vs-difference');
                                card.addEventListener ('mousedown', showBase);
                            }
                        }
                        let glyph = document.createElement ('span');
                        glyph.className = 'glyph';
                        glyph.textContent = unihanCharacter;
                        glyph.style = `font-family: ${localFont};`;
                        glyph.title = localFont;
                        card.appendChild (glyph);
                        let fontName = document.createElement ('span');
                        fontName.className = 'font-name';
                        fontName.textContent = localFont;
                        fontName.title = localFont;
                        card.appendChild (fontName);
                        list.appendChild (card);
                    }
                }
                fontGlyphsContainer.appendChild (list);
                if (compactLayoutCheckbox.checked)
                {
                    fontGlyphsContainer.classList.add ('compact');
                }
            }
        }
        doFilter (nameFilterInput.value);
    }
    //
    const characterRegex = /^(.)(.)?$/u;
    const codePointRegex = /^(?:[Uu]\+?)?([0-9a-fA-F]{4,5})(?:\s+(?:[Uu]\+?)?([0-9a-fA-F]{4,5}))?$/u;
    //
    function validateUnihanCharacter (inputString)
    {
        inputString = inputString.replace (/[<\-,;>]/gu, " ").trim ();
        let base = "";
        let vs = "";
        let match = inputString.match (characterRegex);
        if (match)
        {
            if (regexp.isUnihanVariation (inputString))
            {
                base = match[1];
                vs = match[2];
            }
            else if (regexp.isUnihan (inputString))
            {
                base = match[1];
            }
        }
        else
        {
            match = inputString.match (codePointRegex);
            if (match)
            {
                let string = unicode.codePointsToCharacters (inputString);
                if (regexp.isUnihanVariation (string))
                {
                    base = unicode.codePointsToCharacters (match[1]);
                    vs = unicode.codePointsToCharacters (match[2]);
                }
                else if (regexp.isUnihan (string))
                {
                    base = unicode.codePointsToCharacters (match[1]);
                }
            }
        }
        return `${base}${vs}`;
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
            let [ base, vs ] = character;
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
                    let [ base, vs ] = unihan;
                    let label = `${base}${(process.platform === 'darwin') ? "\t" : "\xA0\xA0"}${unicode.characterToCodePoint (base)}`;
                    if (vs)
                    {
                        label += `\xA0\xA0${unicode.characterToCodePoint (vs)}`;
                    }
                    historyMenuTemplate.push
                    (
                        {
                            label: label,
                            id: unihan,
                            toolTip: Array.from (unihan).map (char => unicode.getCharacterBasicData (char).name).join (",\n"),
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
    compactLayoutCheckbox.checked = prefs.compactLayout;
    compactLayoutCheckbox.addEventListener
    (
        'input',
        (event) =>
        {
            if (event.currentTarget.checked)
            {
                fontGlyphsContainer.classList.add ('compact');
            }
            else
            {
                fontGlyphsContainer.classList.remove ('compact');
            }
        }
    );
    //
    function doFilter (string)
    {
        let filteredCount = 0;
        let totalCount = 0;
        let cards = unit.querySelectorAll ('.glyph-list .card');
        if (cards)
        {
            for (let card of cards)
            {
                card.classList.remove ('is-shown');
                let fontName = card.querySelector ('.font-name').textContent;
                if ((!string) || (fontName.toUpperCase ().indexOf (string.toUpperCase ()) > -1))
                {
                    card.classList.add ('is-shown');
                    filteredCount++;
                }
                totalCount++;
            }
        }
        filteredCountNumber.textContent = filteredCount;
        totalCountNumber.textContent = totalCount;
        fontGlyphsContainer.hidden = (filteredCount === 0);
        errorMessage.hidden = true;
        errorMessage.textContent = "";
        if (currentUnihanCharacter)
        {
            errorMessage.hidden = false;
            if (totalCount === 0)
            {
                errorMessage.textContent = "No suitable font available";
            }
            else if (filteredCount === 0)
            {
                errorMessage.textContent = "No matching font name";
            }
        }
    }
    //
    nameFilterInput.value = prefs.nameFilterInput;
    nameFilterInput.addEventListener ('input', (event) => { doFilter (event.currentTarget.value); });
    //
    currentUnihanCharacter = prefs.unihanCharacter;
    updateUnihanData (currentUnihanCharacter);
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
        unihanHistory: unihanHistory,
        unihanCharacter: currentUnihanCharacter,
        nameFilterInput: nameFilterInput.value,
        compactLayout: compactLayoutCheckbox.checked,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
