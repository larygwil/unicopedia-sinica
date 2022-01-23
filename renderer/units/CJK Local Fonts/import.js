//
const unit = document.getElementById ('cjk-local-fonts-unit');
//
const historyButton = unit.querySelector ('.history-button');
const unihanInput = unit.querySelector ('.unihan-input');
const lookUpButton = unit.querySelector ('.look-up-button');
const compactLayoutCheckbox = unit.querySelector ('.compact-layout-checkbox');
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
        compactLayout: false,
        instructions: true,
        references: false,
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let textSeparator = (process.platform === 'darwin') ? "\t" : "\xA0\xA0";
    //
    unihanHistory = prefs.unihanHistory;
    //
    // const defaultFontSize = 96; // Apple Character Palette
    const defaultFontSize = 48; // Application standard small
    //
    let canvas = document.createElement ('canvas');
    canvas.width = defaultFontSize;
    canvas.height = defaultFontSize;
    let ctx = canvas.getContext ('2d');
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
                    localFonts = await fontList.getFonts ();
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
                    ctx.font = `${defaultFontSize}px ${localFont}, "Blank"`;
                    let width = Math.round (ctx.measureText (unihanCharacter).width);
                    if (width > 0)
                    {
                        let localFontName = localFont.replace (/^"|"$/g, "");
                        let card =  document.createElement ('span');
                        card.className = 'card';
                        let glyph = document.createElement ('span');
                        glyph.className = 'glyph';
                        glyph.dataset.width = width;
                        glyph.textContent = unihanCharacter;
                        glyph.style = `font-family: ${localFont};`;
                        glyph.title = localFontName;
                        card.appendChild (glyph);
                        let fontName = document.createElement ('span');
                        fontName.className = 'font-name';
                        fontName.textContent = localFontName;
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
    }
    //
    const characterOrCodePointRegex = /^\s*(?:(.)\p{Variation_Selector}?|(?:[Uu]\+?)?([0-9a-fA-F]{4,5}))\s*$/u;
    //
    function isSupported (character)
    {
        // return regexp.isUnified (character);
        return regexp.isUnihan (character);
    }
    //
    function parseUnihanCharacter (inputString)
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
            if (!isSupported (character))
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
                if (!parseUnihanCharacter (event.currentTarget.value))
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
                let character = parseUnihanCharacter (unihanInput.value);
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
    //
    let prefs =
    {
        unihanHistory: unihanHistory,
        unihanCharacter: currentUnihanCharacter,
        compactLayout: compactLayoutCheckbox.checked,
        instructions: instructions.open,
        references: references.open
    };
    context.setPrefs (prefs);
};
//
