// Collection Types
export const CT_DAILY_LESSON = "DAILY_LESSON";
export const CT_SATURDAY_LESSON = "SATURDAY_LESSON";
export const CT_WEEKLY_FRIENDS_GATHERING = "WEEKLY_FRIENDS_GATHERING";
export const CT_CONGRESS = "CONGRESS";
export const CT_VIDEO_PROGRAM = "VIDEO_PROGRAM";
export const CT_LECTURE_SERIES = "LECTURE_SERIES";
export const CT_MEALS = "MEALS";
export const CT_HOLIDAY = "HOLIDAY";
export const CT_PICNIC = "PICNIC";
export const CT_UNITY_DAY = "UNITY_DAY";

// Content Unit Types
export const CT_LESSON_PART = "LESSON_PART";
export const CT_LECTURE = "LECTURE";
export const CT_CHILDREN_LESSON_PART = "CHILDREN_LESSON_PART";
export const CT_WOMEN_LESSON_PART = "WOMEN_LESSON_PART";
export const CT_CAMPUS_LESSON = "CAMPUS_LESSON";
export const CT_LC_LESSON = "LC_LESSON";
export const CT_VIRTUAL_LESSON = "VIRTUAL_LESSON";
export const CT_FRIENDS_GATHERING = "FRIENDS_GATHERING";
export const CT_MEAL = "MEAL";
export const CT_VIDEO_PROGRAM_CHAPTER = "VIDEO_PROGRAM_CHAPTER";
export const CT_EVENT_PART = "EVENT_PART";
export const CT_FULL_LESSON = "FULL_LESSON";
export const CT_TEXT = "TEXT";
export const CT_UNKNOWN = "UNKNOWN";

export const CONTENT_TYPE_BY_ID = {
    1: CT_DAILY_LESSON,
    2: CT_SATURDAY_LESSON,
    3: CT_WEEKLY_FRIENDS_GATHERING,
    4: CT_CONGRESS,
    5: CT_VIDEO_PROGRAM,
    6: CT_LECTURE_SERIES,
    7: CT_MEALS,
    8: CT_HOLIDAY,
    9: CT_PICNIC,
    10: CT_UNITY_DAY,
    11: CT_LESSON_PART,
    12: CT_LECTURE,
    13: CT_CHILDREN_LESSON_PART,
    14: CT_WOMEN_LESSON_PART,
    15: CT_CAMPUS_LESSON,
    16: CT_LC_LESSON,
    17: CT_VIRTUAL_LESSON,
    18: CT_FRIENDS_GATHERING,
    19: CT_MEAL,
    20: CT_VIDEO_PROGRAM_CHAPTER,
    21: CT_FULL_LESSON,
    22: CT_TEXT,
    23: CT_SATURDAY_LESSON,
    24: CT_WEEKLY_FRIENDS_GATHERING,
    25: CT_PICNIC,
    26: CT_FRIENDS_GATHERING,
    27: CT_UNKNOWN,
    28: CT_EVENT_PART,
};

// Operation Types
export const OP_CAPTURE_START = "capture_start";
export const OP_CAPTURE_STOP = "capture_stop";
export const OP_DEMUX = "demux";
export const OP_TRIM = "trim";
export const OP_SEND = "send";
export const OP_CONVERT = "convert";
export const OP_UPLOAD = "upload";
export const OP_IMPORT_KMEDIA = "import_kmedia";

export const OPERATION_TYPE_BY_ID = {
    1: OP_CAPTURE_START,
    2: OP_CAPTURE_STOP,
    3: OP_DEMUX,
    4: OP_SEND,
    5: OP_UPLOAD,
    6: OP_TRIM,
    7: OP_IMPORT_KMEDIA,
    8: OP_CONVERT,
};

// Source Types
export const SRC_COLLECTION = "COLLECTION";
export const SRC_BOOK = "BOOK";
export const SRC_VOLUME = "VOLUME";
export const SRC_PART = "PART";
export const SRC_PARASHA = "PARASHA";
export const SRC_CHAPTER = "CHAPTER";
export const SRC_ARTICLE = "ARTICLE";
export const SRC_TITLE = "TITLE";
export const SRC_LETTER = "LETTER";
export const SRC_ITEM = "ITEM";

export const SOURCE_TYPE_BY_ID = {
    1: SRC_COLLECTION,
    2: SRC_BOOK,
    3: SRC_VOLUME,
    4: SRC_PART,
    5: SRC_PARASHA,
    6: SRC_CHAPTER,
    7: SRC_ARTICLE,
    8: SRC_TITLE,
    9: SRC_LETTER,
    10: SRC_ITEM,
};

// Languages
export const LANG_ENGLISH = "en";
export const LANG_HEBREW = "he";
export const LANG_RUSSIAN = "ru";
export const LANG_SPANISH = "es";
export const LANG_ITALIAN = "it";
export const LANG_GERMAN = "de";
export const LANG_DUTCH = "nl";
export const LANG_FRENCH = "fr";
export const LANG_PORTUGUESE = "pt";
export const LANG_TURKISH = "tr";
export const LANG_POLISH = "pl";
export const LANG_ARABIC = "ar";
export const LANG_HUNGARIAN = "hu";
export const LANG_FINNISH = "fi";
export const LANG_LITHUANIAN = "lt";
export const LANG_JAPANESE = "ja";
export const LANG_BULGARIAN = "bg";
export const LANG_GEORGIAN = "ka";
export const LANG_NORWEGIAN = "no";
export const LANG_SWEDISH = "sv";
export const LANG_CROATIAN = "hr";
export const LANG_CHINESE = "zh";
export const LANG_PERSIAN = "fa";
export const LANG_ROMANIAN = "ro";
export const LANG_HINDI = "hi";
export const LANG_UKRAINIAN = "ua";
export const LANG_MACEDONIAN = "mk";
export const LANG_SLOVENIAN = "sl";
export const LANG_LATVIAN = "lv";
export const LANG_SLOVAK = "sk";
export const LANG_CZECH = "cs";
export const LANG_MULTI = "zz";
export const LANG_UNKNOWN = "xx";

export const LANGUAGES = {
    [LANG_ENGLISH]: {text: "English", value: LANG_ENGLISH},
    [LANG_HEBREW]: {text: "Hebrew", value: LANG_HEBREW},
    [LANG_RUSSIAN]: {text: "Russian", value: LANG_RUSSIAN},
    [LANG_SPANISH]: {text: "Spanish", value: LANG_SPANISH},
    [LANG_ITALIAN]: {text: "Italian", value: LANG_ITALIAN},
    [LANG_GERMAN]: {text: "German", value: LANG_GERMAN},
    [LANG_DUTCH]: {text: "Dutch", value: LANG_DUTCH},
    [LANG_FRENCH]: {text: "French", value: LANG_FRENCH},
    [LANG_PORTUGUESE]: {text: "Portuguese", value: LANG_PORTUGUESE},
    [LANG_TURKISH]: {text: "Turkish", value: LANG_TURKISH},
    [LANG_POLISH]: {text: "Polish", value: LANG_POLISH},
    [LANG_ARABIC]: {text: "Arabic", value: LANG_ARABIC},
    [LANG_HUNGARIAN]: {text: "Hungarian", value: LANG_HUNGARIAN},
    [LANG_FINNISH]: {text: "Finnish", value: LANG_FINNISH},
    [LANG_LITHUANIAN]: {text: "Lithuanian", value: LANG_LITHUANIAN},
    [LANG_JAPANESE]: {text: "Japanese", value: LANG_JAPANESE},
    [LANG_BULGARIAN]: {text: "Bulgarian", value: LANG_BULGARIAN},
    [LANG_GEORGIAN]: {text: "Georgian", value: LANG_GEORGIAN},
    [LANG_NORWEGIAN]: {text: "Norwegian", value: LANG_NORWEGIAN},
    [LANG_SWEDISH]: {text: "Swedish", value: LANG_SWEDISH},
    [LANG_CROATIAN]: {text: "Croatian", value: LANG_CROATIAN},
    [LANG_CHINESE]: {text: "Chinese", value: LANG_CHINESE},
    [LANG_PERSIAN]: {text: "Persian", value: LANG_PERSIAN},
    [LANG_ROMANIAN]: {text: "Romanian", value: LANG_ROMANIAN},
    [LANG_HINDI]: {text: "Hindi", value: LANG_HINDI},
    [LANG_UKRAINIAN]: {text: "Ukrainian", value: LANG_UKRAINIAN},
    [LANG_MACEDONIAN]: {text: "Macedonian", value: LANG_MACEDONIAN},
    [LANG_SLOVENIAN]: {text: "Slovenian", value: LANG_SLOVENIAN},
    [LANG_LATVIAN]: {text: "Latvian", value: LANG_LATVIAN},
    [LANG_SLOVAK]: {text: "Slovak", value: LANG_SLOVAK},
    [LANG_CZECH]: {text: "Czech", value: LANG_CZECH},
    [LANG_MULTI]: {text: "Multi", value: LANG_MULTI},
    [LANG_UNKNOWN]: {text: "Unknown", value: LANG_UNKNOWN},
};