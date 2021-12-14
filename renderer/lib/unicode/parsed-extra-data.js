//
const fs = require ('fs');
const path = require ('path');
//
// https://www.unicode.org/Public/5.1.0/ucd/UCD.html
// https://www.unicode.org/reports/tr44/
//
let lines;
//
let versions = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/DerivedAge.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'DerivedAge.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s*;\s*(\d+\.\d+)\s*#/);
        if (found)
        {
            versions.push ({ first: found[1], last: found[2] || found[1], age: found[3] });
        }
    }
}
//
let blocks = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/Blocks.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'Blocks.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})\.\.([0-9a-fA-F]{4,});\s+(.+)$/);
        if (found)
        {
            blocks.push ({ first: found[1], last: found[2], name: found[3] });
        }
    }
}
//
let extendedProperties = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/PropList.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'PropList.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s*;\s+(\w+)\s+#/);
        if (found)
        {
            extendedProperties.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let coreProperties = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'DerivedCoreProperties.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            coreProperties.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let emojiProperties = [ ];
//
// Copy of https://www.unicode.org/Public/14.0.0/ucd/emoji/emoji-data.txt
lines = fs.readFileSync (path.join (__dirname, 'emoji', 'emoji-data.txt'), { encoding: 'utf8' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s*#/);
        if (found)
        {
            emojiProperties.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let scripts = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/Scripts.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'Scripts.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            scripts.push ({ first: found[1], last: found[2] || found[1], name: found[3] });
        }
    }
}
//
let scriptExtensions = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/ScriptExtensions.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'ScriptExtensions.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+([\w\s]+)\s+#/);
        if (found)
        {
            scriptExtensions.push ({ first: found[1], last: found[2] || found[1], aliases: found[3] });
        }
    }
}
//
let equivalentUnifiedIdeographs = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/EquivalentUnifiedIdeograph.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'EquivalentUnifiedIdeograph.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+([0-9a-fA-F]{4,})\s+#/);
        if (found)
        {
            equivalentUnifiedIdeographs.push ({ first: found[1], last: found[2] || found[1], equivalent: found[3] });
        }
    }
}
//
let eastAsianWidths = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'EastAsianWidth.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?;(\w+)\s+#/);
        if (found)
        {
            eastAsianWidths.push ({ first: found[1], last: found[2] || found[1], width: found[3] });
        }
    }
}
//
let verticalOrientations = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/VerticalOrientation.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'VerticalOrientation.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            verticalOrientations.push ({ first: found[1], last: found[2] || found[1], orientation: found[3] });
        }
    }
}
//
let lineBreaks = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/LineBreak.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'LineBreak.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?;(\w+)\s+#/);
        if (found)
        {
            lineBreaks.push ({ first: found[1], last: found[2] || found[1], property: found[3] });
        }
    }
}
let indicPositionalCategories = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/IndicPositionalCategory.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'IndicPositionalCategory.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            indicPositionalCategories.push ({ first: found[1], last: found[2] || found[1], property: found[3] });
        }
    }
}
//
let indicSyllabicCategories = [ ];
//
// Copy of https://www.unicode.org/Public/UNIDATA/IndicSyllabicCategory.txt
lines = fs.readFileSync (path.join (__dirname, 'UNIDATA', 'IndicSyllabicCategory.txt'), { encoding: 'ascii' }).split (/\r?\n/);
for (let line of lines)
{
    if (line && (line[0] !== "#"))
    {
        let found = line.match (/^([0-9a-fA-F]{4,})(?:\.\.([0-9a-fA-F]{4,}))?\s+;\s+(\w+)\s+#/);
        if (found)
        {
            indicSyllabicCategories.push ({ first: found[1], last: found[2] || found[1], property: found[3] });
        }
    }
}
//
module.exports =
{
    versions,
    blocks,
    extendedProperties,
    coreProperties,
    emojiProperties,
    scripts,
    scriptExtensions,
    equivalentUnifiedIdeographs,
    eastAsianWidths,
    verticalOrientations,
    lineBreaks,
    indicPositionalCategories,
    indicSyllabicCategories
};
//
