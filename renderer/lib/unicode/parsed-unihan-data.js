//
// https://www.unicode.org/reports/tr38/
//
// All data in the Unihan database is stored in UTF-8 using Normalization Form C (NFC).
// Note, however, that the "Syntax" descriptions below, used for validation of field values,
// operate on Normalization Form D (NFD), primarily because that makes the regular expressions simpler.
//
const tags =
{
    "kAccountingNumeric":
    {
        "name": "Accounting Numeric",
        "category": "Numeric Values",
        "separator": " ",
        "syntax": "[0-9]+"
    },
    "kBigFive":
    {
        "name": "Big Five",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kCangjie":
    {
        "name": "Cangjie",
        "category": "Dictionary-like Data",
        "syntax": "[A-Z]+"
    },
    "kCantonese":
    {
        "name": "Cantonese",
        "category": "Readings",
        "separator": " ",
        "syntax": "[a-z]{1,6}[1-6]"
    },
    "kCCCII":
    {
        "name": "CCCII (Chinese Character Code for Information Interchange)",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9A-F]{6}"
    },
    "kCheungBauer":
    {
        "name": "Cheung-Bauer",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[0-9]{3}\\/[0-9]{2};[A-Z]*;[a-z1-6\\[\\]\\/,]+"
    },
    "kCheungBauerIndex":
    {
        "name": "Cheung-Bauer Index",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{3}\\.[01][0-9]"
    },
    "kCihaiT":
    {
        "name": "Cihai",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}\\.[0-9]{3}"
    },
    "kCNS1986":
    {
        "name": "CNS 11643-1986",
        "category": "Other Mappings",
        "syntax": "[12E]-[0-9A-F]{4}"
    },
    "kCNS1992":
    {
        "name": "CNS 11643-1992",
        "category": "Other Mappings",
        "syntax": "[1-9]-[0-9A-F]{4}"
    },
    "kCompatibilityVariant":
    {
        "name": "Compatibility Variant",
        "category": "Variants", // Originally "IRG Sources"
        "syntax": "U\\+[23]?[0-9A-F]{4}"
    },
    "kCowles":
    {
        "name": "Cowles",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{1,4}(\\.[0-9]{1,2})?"
    },
    "kDaeJaweon":
    {
        "name": "Dae Jaweon",
        "category": "Dictionary Indices",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kDefinition":
    {
        "name": "Definition",
        "category": "Readings",
        "syntax": "[^\\t\"]+"
    },
    "kEACC":
    {
        "name": "EACC (East Asian Character Code for Bibliographic Use)",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{6}"
    },
    "kFenn":
    {
        "name": "Fenn",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[0-9]+a?[A-KP*]"
    },
    "kFennIndex":
    {
        "name": "Fenn Index",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9][0-9]{0,2}\\.[01][0-9]"
    },
    "kFourCornerCode":
    {
        "name": "Four-Corner Code",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[0-9]{4}(\\.[0-9])?"
    },
    "kFrequency":
    {
        "name": "Frequency",
        "category": "Dictionary-like Data",
        "syntax": "[1-5]"
    },
    "kGB0":
    {
        "name": "GB/T 2312-1980",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB1":
    {
        "name": "GB/T 12345-1990",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB3":
    {
        "name": "GB/T 13131",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB5":
    {
        "name": "GB/T 13132",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB7":
    {
        "name": "General Purpose Hanzi List for Modern Chinese Language, and General List of Simplified Hanzi",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGB8":
    {
        "name": "GB 8565.2-1988",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kGradeLevel":
    {
        "name": "Grade Level",
        "category": "Dictionary-like Data",
        "syntax": "[1-6]"
    },
    "kGSR":
    {
        "name": "GSR (Grammata Serica Recensa)",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{4}[a-vx-z]'?"
    },
    "kHangul":
    {
        "name": "Hangul",
        "category": "Readings",
        "separator": " ",
        "syntax": "[\\u{1100}-\\u{1112}][\\u{1161}-\\u{1175}][\\u{11A8}-\\u{11C2}]?:[01ENX]{1,3}"
    },
    "kHanYu":
    {
        "name": "Hanyu Da Zidian (HDZ)",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][0-3]"
    },
    "kHanyuPinlu":
    {
        "name": "Xiandai Hanyu Pinlu Cidian",
        "category": "Readings",
        "separator": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+\\([0-9]+\\)"
    },
    "kHanyuPinyin":
    {
        "name": "Hanyu Pinyin",
        "category": "Readings",
        "separator": " ",
        "syntax": "(\\d{5}\\.\\d{2}0,)*\\d{5}\\.\\d{2}0:([a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+,)*[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kHDZRadBreak":
    {
        "name": "HDZ (Hanyu Da Zidian) Radical Break",
        "category": "Dictionary-like Data",
        "syntax": "[\\u{2F00}-\\u{2FD5}]\\[U\\+2F[0-9A-D][0-9A-F]\\]:[1-8][0-9]{4}\\.[0-3][0-9]0"
    },
    "kHKGlyph":
    {
        "name": "HK Glyph",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kHKSCS":
    {
        "name": "HK SCS (Hong Kong Supplementary Character)",
        "category": "Other Mappings",
        "syntax": "[0-9A-F]{4}"
    },
    "kIBMJapan":
    {
        "name": "IBM Japan",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "F[ABC][0-9A-F]{2}"
    },
    "kIICore":
    {
        "name": "IICore (International Ideographs Core)",
        "category": "IRG Sources",
        "separator": " ",
        "syntax": "[ABC][GHJKMPT]{1,7}"
    },
    "kIRGDaeJaweon":
    {
        "name": "IRG Dae Jaweon",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kIRGDaiKanwaZiten":
    {
        "name": "IRG Dai Kanwa Ziten",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{5}'?"
    },
    "kIRGHanyuDaZidian":
    {
        "name": "IRG Hanyu Da Zidian",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-8][0-9]{4}\\.[0-3][0-9][01]"
    },
    "kIRGKangXi":
    {
        "name": "IRG KangXi",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[01][0-9]{3}\\.[0-7][0-9][01]"
    },
    "kIRG_GSource":
    {
        "name": "IRG Source: China",
        "category": "IRG Sources",
        "syntax": "G[013578EKS]-[0-9A-F]{4}|G4K(-\\d{5})?|G(DZ|GH|RM|WZ|XC|XH|ZH)-\\d{4}\\.\\d{2}|G(BK|CH|CY|HC)(-\\d{4}\\.\\d{2})?|GKX-\\d{4}\\.\\d{2,3}|G(HZ|HZR)-\\d{5}\\.\\d{2}|G(CE|FC|IDC|OCD|XHZ)-\\d{3}|G(H|HF|LGYJ|PGLG|T)-\\d{4}|G(CYY|DM|JZ|KJ|ZFY|ZJW|ZYS)-\\d{5}|GFZ-[0-9A-F]{4}|GGFZ-\\d{6}|G(LK|Z)-\\d{7}|GU-[023][0-9A-F]{4}"
    },
    "kIRG_HSource":
    {
        "name": "IRG Source: Hong Kong",
        "category": "IRG Sources",
        "syntax": "H-[0-9A-F]{4}|H(B[012]|D)-[0-9A-F]{4}|HU-[023][0-9A-F]{4}"
    },
    "kIRG_JSource":
    {
        "name": "IRG Source: Japan",
        "category": "IRG Sources",
        "syntax": "J[014]-[0-9A-F]{4}|J3A?-[0-9A-F]{4}|J13A?-[0-9A-F]{4}|J14-[0-9A-F]{4}|JA[34]?-[0-9A-F]{4}|JARIB-[0-9A-F]{4}|JH-(JT[ABC][0-9A-F]{3}S?|IB\\d{4}|\\d{6})|JK-\\d{5}|JMJ-\\d{6}"
    },
    "kIRG_KPSource":
    {
        "name": "IRG Source: North Korea",
        "category": "IRG Sources",
        "syntax": "KP([01]-[0-9A-F]{4}|U-[023][0-9A-F]{4})"
    },
    "kIRG_KSource":
    {
        "name": "IRG Source: South Korea",
        "category": "IRG Sources",
        "syntax": "K[0-6]-[0-9A-F]{4}|KC-\\d{5}|KU-[023][0-9A-F]{4}"
    },
    "kIRG_MSource":
    {
        "name": "IRG Source: Macao",
        "category": "IRG Sources",
        "syntax": "MA-[0-9A-F]{4}|MB[12]-[0-9A-F]{4}|MC-\\d{5}|MDH?-[23]?[0-9A-F]{4}"
    },
    "kIRG_SSource":
    {
        "name": "IRG Source: SAT",
        "category": "IRG Sources",
        "syntax": "SAT-\\d{5}"
    },
    "kIRG_TSource":
    {
        "name": "IRG Source: Taiwan",
        "category": "IRG Sources",
        "syntax": "T([1-7A-F]|1[13])-[0-9A-F]{4}|TU-[023][0-9A-F]{4}"
    },
    "kIRG_UKSource":
    {
        "name": "IRG Source: U.K.",
        "category": "IRG Sources",
        "syntax": "UK-\\d{5}"
    },
    "kIRG_USource":
    {
        "name": "IRG Source: UTC",
        "category": "IRG Sources",
        "syntax": "UTC-\\d{5}"
    },
    "kIRG_VSource":
    {
        "name": "IRG Source: Vietnam",
        "category": "IRG Sources",
        "syntax": "V[0-4]-[0-9A-F]{4}|VN-[023F][0-9A-F]{4}"
    },
    "kJa":
    {
        "name": "JA (Unified Japanese IT Vendors Contemporary Ideographs, 1993)",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9A-F]{4}S?"
    },
    "kJapaneseKun":
    {
        "name": "Japanese Kun-Yomi",
        "category": "Readings",
        "separator": " ",
        "syntax": "[A-Z]+"
    },
    "kJapaneseOn":
    {
        "name": "Japanese On-Yomi",
        "category": "Readings",
        "separator": " ",
        "syntax": "[A-Z]+"
    },
    "kJinmeiyoKanji":
    {
        "name": "Jinmeiyō Kanji",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "(20[0-9]{2})(:U\\+[23]?[0-9A-F]{4})?"
    },
    "kJis0":
    {
        "name": "JIS X 0208-1990",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kJIS0213":
    {
        "name": "JIS X 0213:2004",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[12],[0-9]{2},[0-9]{1,2}"
    },
    "kJis1":
    {
        "name": "JIS X 0212-1990",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kJoyoKanji":
    {
        "name": "Jōyō Kanji",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "(20[0-9]{2})|(U\\+[23]?[0-9A-F]{4})"
    },
    "kKangXi":
    {
        "name": "KangXi",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{4}\\.[0-9]{2}[01]"
    },
    "kKarlgren":
    {
        "name": "Karlgren",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}[A*]?"
    },
    "kKorean":
    {
        "name": "Korean",
        "category": "Readings",
        "separator": " ",
        "syntax": "[A-Z]+"
    },
    "kKoreanEducationHanja":
    {
        "name": "Korean Education Hanja",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "20[0-9]{2}"
    },
    "kKoreanName":
    {
        "name": "Korean Name",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "20[0-9]{2}"
    },
    "kKPS0":
    {
        "name": "KPS 9566-97",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9A-F]{4}"
    },
    "kKPS1":
    {
        "name": "KPS 10721-2000",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9A-F]{4}"
    },
    "kKSC0":
    {
        "name": "KS X 1001:1992 (KS C 5601-1989)",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kKSC1":
    {
        "name": "KS X 1002:1991 (KS C 5657-1991)",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kLau":
    {
        "name": "Lau",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}"
    },
    "kMainlandTelegraph":
    {
        "name": "Mainland Telegraph",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kMandarin":
    {
        "name": "Mandarin",
        "category": "Readings",
        "separator": " ",
        "syntax": "[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kMatthews":
    {
        "name": "Matthews",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}(a|\\.5)?"
    },
    "kMeyerWempe":
    {
        "name": "Meyer-Wempe",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}[a-t*]?"
    },
    "kMorohashi":
    {
        "name": "Morohashi",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{5}'?"
    },
    "kNelson":
    {
        "name": "Nelson",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kOtherNumeric":
    {
        "name": "Other Numeric",
        "category": "Numeric Values",
        "separator": " ",
        "syntax": "[0-9]+"
    },
    "kPhonetic":
    {
        "name": "Phonetic Index (Ten Thousand Characters: An Analytic Dictionary)",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,3}[A-Dx]?[*+]?"
    },
    "kPrimaryNumeric":
    {
        "name": "Primary Numeric",
        "category": "Numeric Values",
        "separator": " ",
        "syntax": "[0-9]+"
    },
    "kPseudoGB1":
    {
        "name": "\"GB/T 12345-1990\"",
        "category": "Other Mappings",
        "syntax": "[0-9]{4}"
    },
    "kRSAdobe_Japan1_6":
    {
        "name": "Adobe-Japan1-6 Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "separator": " ",
        "syntax": "[CV]\\+[0-9]{1,5}\\+[1-9][0-9]{0,2}\\.[1-9][0-9]?\\.[0-9]{1,2}"
    },
    "kRSKangXi":
    {
        "name": "KangXi Radical-Stroke Count",
        "category": "Radical-Stroke Counts",
        "separator": " ",
        "syntax": "[1-9][0-9]{0,2}\\.-?[0-9]{1,2}"
    },
    "kRSUnicode":
    {
        "name": "Unicode Radical-Stroke Count",
        "category": "Radical-Stroke Counts",    // Originally "IRG Sources"
        "separator": " ",
        "syntax": "[1-9][0-9]{0,2}'?\\.-?[0-9]{1,2}"
    },
    "kSBGY":
    {
        "name": "SBGY (Song Ben Guang Yun)",
        "category": "Dictionary Indices",
        "separator": " ",
        "syntax": "[0-9]{3}\\.[0-7][0-9]"
    },
    "kSemanticVariant":
    {
        "name": "Semantic Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kSimplifiedVariant":
    {
        "name": "Simplified Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}"
    },
    "kSpecializedSemanticVariant":
    {
        "name": "Specialized Semantic Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZFJ]+)?(,k[A-Za-z0-9]+(:[TBZFJ]+)?)*)?"
    },
    "kSpoofingVariant":
    {
        "name": "Spoofing Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}"
    },
    "kStrange":
    {
        "name": "Strange",
        "category": "Dictionary-like Data",
        "separator": " ",
        "syntax": "[ACU]|B:U\\+31[0-2AB][0-9A-F]|[FMOR](:U\\+[23]?[0-9A-F]{4})?|H:U\\+31[3-8][0-9A-F]|I(:U\\+[23]?[0-9A-F]{4})*|K(:U\\+30[A-F][0-9A-F])+|S:[4-9][0-9]"
    },
    "kTaiwanTelegraph":
    {
        "name": "Taiwan Telegraph",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{4}"
    },
    "kTang":
    {
        "name": "Tang",
        "category": "Readings",
        "separator": " ",
        "syntax": "\\*?[A-Za-z()\\u{E6}\\u{251}\\u{259}\\u{25B}\\u{300}\\u{30C}]+"
    },
    "kTGH":
    {
        "name": "TGH (Tōngyòng Guīfàn Hànzìbiǎo)",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "20[0-9]{2}:[1-9][0-9]{0,3}"
    },
    "kTGHZ2013":
    {
        "name": "TGHZ (Tōngyòng Guīfàn Hànzì Zìdiǎn)",
        "category": "Readings",
        "separator": " ",
        "syntax": "[0-9]{3}\\.[0-9]{3}(,[0-9]{3}\\.[0-9]{3})*:[a-z\\u{300}-\\u{302}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kTotalStrokes":
    {
        "name": "Total Strokes",
        "category": "Radical-Stroke Counts",  // Originally "IRG Sources"
        "separator": " ",
        "syntax": "[1-9][0-9]{0,2}"
    },
    "kTraditionalVariant":
    {
        "name": "Traditional Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}"
    },
    "kUnihanCore2020":
    {
        "name": "Unihan Core (2020)",
        "category": "Dictionary-like Data",
        "syntax": "[GHJKMPT]{1,7}"
    },
    "kVietnamese":
    {
        "name": "Vietnamese",
        "category": "Readings",
        "separator": " ",
        "syntax": "[A-Za-z\\u{110}\\u{111}\\u{300}-\\u{303}\\u{306}\\u{309}\\u{31B}\\u{323}]+"
    },
    "kXerox":
    {
        "name": "Xerox",
        "category": "Other Mappings",
        "separator": " ",
        "syntax": "[0-9]{3}:[0-9]{3}"
    },
    "kXHC1983":
    {
        "name": "XHC (Xiàndài Hànyǔ Cídiǎn) 1983",
        "category": "Readings",
        "separator": " ",
        "syntax": "[0-9]{4}\\.[0-9]{3}\\*?(,[0-9]{4}\\.[0-9]{3}\\*?)*:[a-z\\u{300}\\u{301}\\u{304}\\u{308}\\u{30C}]+"
    },
    "kZVariant":
    {
        "name": "Shape (Z-) Variant",
        "category": "Variants",
        "separator": " ",
        "syntax": "U\\+[23]?[0-9A-F]{4}(<k[A-Za-z0-9]+(:[TBZ]+)?(,k[A-Za-z0-9]+(:[TBZ]+)?)*)?"
    }
};
//
for (let tag in tags)
{
    if ("syntax" in tags[tag])
    {
        tags[tag]["regex"] = new RegExp ( '^(' + tags[tag]["syntax"] + ')$', 'u');
    }
}
//
// Tag categories (field types)
///
const categories =
[
    {
        "name": "Dictionary Indices",
        "tags":
        [
            "kCheungBauerIndex",
            "kCowles",
            "kDaeJaweon",
            "kFennIndex",
            "kGSR",
            "kHanYu",
            "kIRGDaeJaweon",
            "kIRGDaiKanwaZiten",
            "kIRGHanyuDaZidian",
            "kIRGKangXi",
            "kKangXi",
            "kKarlgren",
            "kLau",
            "kMatthews",
            "kMeyerWempe",
            "kMorohashi",
            "kNelson",
            "kSBGY"
        ]
    },
    {
        "name": "Dictionary-like Data",
        "tags":
        [
            "kCangjie",
            "kCheungBauer",
            "kCihaiT",
            "kFenn",
            "kFourCornerCode",
            "kFrequency",
            "kGradeLevel",
            "kHDZRadBreak",
            "kHKGlyph",
            "kPhonetic",
            "kStrange",
            "kUnihanCore2020"
        ]
    },
    {
        "name": "IRG Sources",
        "tags":
        [
            "kIICore",
            "kIRG_GSource",
            "kIRG_HSource",
            "kIRG_JSource",
            "kIRG_KPSource",
            "kIRG_KSource",
            "kIRG_MSource",
            "kIRG_SSource",
            "kIRG_TSource",
            "kIRG_UKSource",
            "kIRG_USource",
            "kIRG_VSource"
        ]
    },
    {
        "name": "Numeric Values",
        "tags":
        [
            "kAccountingNumeric",
            "kOtherNumeric",
            "kPrimaryNumeric"
        ]
    },
    {
        "name": "Other Mappings",
        "tags":
        [
            "kBigFive",
            "kCCCII",
            "kCNS1986",
            "kCNS1992",
            "kEACC",
            "kGB0",
            "kGB1",
            "kGB3",
            "kGB5",
            "kGB7",
            "kGB8",
            "kHKSCS",
            "kIBMJapan",
            "kJa",
            "kJinmeiyoKanji",
            "kJis0",
            "kJIS0213",
            "kJis1",
            "kJoyoKanji",
            "kKoreanEducationHanja",
            "kKoreanName",
            "kKPS0",
            "kKPS1",
            "kKSC0",
            "kKSC1",
            "kMainlandTelegraph",
            "kPseudoGB1",
            "kTaiwanTelegraph",
            "kTGH",
            "kXerox"
        ]
    },
    {
        "name": "Radical-Stroke Counts",
        "tags":
        [
            "kRSAdobe_Japan1_6",
            "kRSKangXi",
            "kRSUnicode",   // Originally in "IRG Sources"
            "kTotalStrokes" // Originally in "IRG Sources"
        ]
    },
    {
        "name": "Readings",
        "tags":
        [
            "kCantonese",
            "kDefinition",
            "kHangul",
            "kHanyuPinlu",
            "kHanyuPinyin",
            "kJapaneseKun",
            "kJapaneseOn",
            "kKorean",
            "kMandarin",
            "kTang",
            "kTGHZ2013",
            "kVietnamese",
            "kXHC1983"
        ]
    },
    {
        "name": "Variants",
        "tags":
        [
            "kCompatibilityVariant",   // Originally in "IRG Sources"
            "kSemanticVariant",
            "kSimplifiedVariant",
            "kSpecializedSemanticVariant",
            "kSpoofingVariant",
            "kTraditionalVariant",
            "kZVariant"
        ]
    }
];
//
function parseUnihanTag (codePoint, tag, value)
{
    let values = [ value ];
    //
    // https://www.unicode.org/reports/tr38/
    //
    // Validation is done as follows:
    // The entry is split into subentries using the Delimiter (if defined),
    // and each subentry converted to Normalization Form D (NFD).
    // The value is valid if and only if each normalized subentry matches the field’s Syntax regular expression.
    if (tag in tags)
    {
        if ("separator" in tags[tag])
        {
            values = value.split (tags[tag]["separator"]);
        }
        if ("regex" in tags[tag])
        {
            let regex = tags[tag]["regex"];
            values.forEach
            (
                value =>
                {
                    if (!regex.test (value.normalize ('NFD')))
                    {
                        console.log ("Invalid Syntax:", codePoint, tag, value);
                    }
                }
            );
        }
    }
    //
    return (values.length > 1) ? values : values[0];
}
//
const fs = require ('fs');
const path = require ('path');
//
// Copy of https://www.unicode.org/Public/UNIDATA/Unihan.zip
//
const filenames =
[
    "Unihan_DictionaryIndices.txt",
    "Unihan_DictionaryLikeData.txt",
    "Unihan_IRGSources.txt",
    "Unihan_NumericValues.txt",
    "Unihan_OtherMappings.txt",
    "Unihan_RadicalStrokeCounts.txt",
    "Unihan_Readings.txt",
    "Unihan_Variants.txt"
];
//
const codePoints = { };
//
for (let filename of filenames)
{
    let lines = fs.readFileSync (path.join (__dirname, 'Unihan', filename), { encoding: 'utf8' }).split (/\r?\n/);
    for (let line of lines)
    {
        if (line && (line[0] !== "#"))
        {
            let found = line.match (/^(U\+[23]?[0-9A-F]{4})\t(\w+)\t(.+)$/);    // Regex updated for Unicode 13.0
            if (found)
            {
                if (!(found[1] in codePoints))
                {
                    codePoints[found[1]] = { };
                }
                codePoints[found[1]][found[2]] = parseUnihanTag (found[1], found[2], found[3]);
            }
        }
    }
}
//
const fullSet = Object.keys (codePoints).sort ((a, b) => parseInt (a.replace ("U+", ""), 16) - parseInt (b.replace ("U+", ""), 16));
const coreSet = fullSet.filter (key => ("kIICore" in codePoints[key]));
const core2020Set = fullSet.filter (key => ("kUnihanCore2020" in codePoints[key]));
//
const regexp = require ('../../lib/unicode/regexp.js');
//
const codePointOrHanCharacterPattern = '\\b(U\\+[0-9a-fA-F]{4,5})\\b|(\\p{Script=Han})';
const codePointOrHanCharacterRegex = regexp.build (codePointOrHanCharacterPattern, { useRegex: true, global: true });
//
const related = { };
fullSet.forEach
(
    key =>
    {
        if ("kDefinition" in codePoints[key])
        {
            let keyCharacter = String.fromCodePoint (parseInt (key.replace ("U+", ""), 16));
            let characters = [ ];
            let definition = codePoints[key]["kDefinition"];
            let matches = definition.matchAll (codePointOrHanCharacterRegex);
            for (let match of matches)
            {
                let character;
                if (match[1])
                {
                    character = String.fromCodePoint (parseInt (match[1].replace ("U+", ""), 16));
                }
                else if (match[2])
                {
                    character = match[2];
                }
                if (regexp.isUnihan (character))
                {
                    characters.push (character);
                }
            }
            characters = [...new Set (characters)].sort (); // Remove duplicates and reorder by ascending code point value
            for (let character of characters)
            {
                if (character !== keyCharacter)
                {
                    if (!(character in related))
                    {
                        related[character] = [ ];
                    }
                    related[character].push (keyCharacter);
                }
            }
        }
    }
);
//
module.exports =
{
    tags,
    categories,
    codePoints,
    fullSet,
    coreSet,
    core2020Set,
    related
};
//
