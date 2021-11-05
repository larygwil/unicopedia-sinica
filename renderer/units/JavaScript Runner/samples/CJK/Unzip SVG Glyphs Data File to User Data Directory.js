// Unzip SVG Glyphs Data File to User Data Directory
const path = require ('path');
const extract = require ('extract-zip');
// Note: the zip file is assumed to be in the Downloads repertory
const source = path.join ($.getpath ('downloads'), "svg-glyphs-14.0.zip");
const target = $.getpath ('userData');
async function main ()
{
    try
    {
        await extract (source, { dir: target });
        $.clear ();
        $.writeln ("Extraction completed.");
    }
    catch (err)
    {
        $.clear ();
        $.writeln ("Extraction failed:", err);
    }
}
$.writeln ("Please wait...");
main ();
