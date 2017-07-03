
// Use these for immutable default values
export const EMPTY_ARRAY = Object.freeze([]);
export const EMPTY_OBJECT = Object.freeze({});


// Collection Types
export const CT_DAILY_LESSON       = 'DAILY_LESSON';
export const CT_SPECIAL_LESSON     = 'SPECIAL_LESSON';
export const CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
export const CT_CONGRESS           = 'CONGRESS';
export const CT_VIDEO_PROGRAM      = 'VIDEO_PROGRAM';
export const CT_LECTURE_SERIES     = 'LECTURE_SERIES';
export const CT_MEALS              = 'MEALS';
export const CT_HOLIDAY            = 'HOLIDAY';
export const CT_PICNIC             = 'PICNIC';
export const CT_UNITY_DAY          = 'UNITY_DAY';

// Content Unit Types
export const CT_LESSON_PART           = 'LESSON_PART';
export const CT_LECTURE               = 'LECTURE';
export const CT_CHILDREN_LESSON_PART  = 'CHILDREN_LESSON_PART';
export const CT_WOMEN_LESSON_PART     = 'WOMEN_LESSON_PART';
export const CT_VIRTUAL_LESSON        = 'VIRTUAL_LESSON';
export const CT_FRIENDS_GATHERING     = 'FRIENDS_GATHERING';
export const CT_MEAL                  = 'MEAL';
export const CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
export const CT_FULL_LESSON           = 'FULL_LESSON';
export const CT_TEXT                  = 'TEXT';
export const CT_UNKNOWN               = 'UNKNOWN';
export const CT_EVENT_PART            = 'EVENT_PART';
export const CT_CLIP                  = 'CLIP';
export const CT_TRAINING              = 'TRAINING';
export const CT_KITEI_MAKOR           = 'KITEI_MAKOR';

export const CONTENT_TYPE_BY_ID = {
  1: CT_DAILY_LESSON,
  2: CT_SPECIAL_LESSON,
  3: CT_FRIENDS_GATHERINGS,
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
  16: CT_VIRTUAL_LESSON,
  18: CT_FRIENDS_GATHERING,
  19: CT_MEAL,
  20: CT_VIDEO_PROGRAM_CHAPTER,
  21: CT_FULL_LESSON,
  22: CT_TEXT,
  27: CT_UNKNOWN,
  28: CT_EVENT_PART,
  29: CT_CLIP,
  30: CT_TRAINING,
  31: CT_KITEI_MAKOR,
};

// Operation Types
export const OP_CAPTURE_START = 'capture_start';
export const OP_CAPTURE_STOP  = 'capture_stop';
export const OP_DEMUX         = 'demux';
export const OP_TRIM          = 'trim';
export const OP_SEND          = 'send';
export const OP_CONVERT       = 'convert';
export const OP_UPLOAD        = 'upload';
export const OP_IMPORT_KMEDIA = 'import_kmedia';

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
export const SRC_COLLECTION = 'COLLECTION';
export const SRC_BOOK       = 'BOOK';
export const SRC_VOLUME     = 'VOLUME';
export const SRC_PART       = 'PART';
export const SRC_PARASHA    = 'PARASHA';
export const SRC_CHAPTER    = 'CHAPTER';
export const SRC_ARTICLE    = 'ARTICLE';
export const SRC_TITLE      = 'TITLE';
export const SRC_LETTER     = 'LETTER';
export const SRC_ITEM       = 'ITEM';

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

export const SOURCE_TYPES = {
  [SRC_COLLECTION]: { text: 'אוסף', value: 1, },
  [SRC_BOOK]: { text: 'ספר', value: 2, },
  [SRC_VOLUME]: { text: 'כרך', value: 3, },
  [SRC_PART]: { text: 'חלק', value: 4, },
  [SRC_PARASHA]: { text: 'פרשה', value: 5, },
  [SRC_CHAPTER]: { text: 'פרק', value: 6, },
  [SRC_ARTICLE]: { text: 'מאמר', value: 7, },
  [SRC_TITLE]: { text: 'כותרת', value: 8, },
  [SRC_LETTER]: { text: 'אות', value: 9, },
  [SRC_ITEM]: { text: 'פריט', value: 10, },
};

export const SOURCE_TYPES_OPTIONS = Array.from(Object.values(SOURCE_TYPES));

export const SEC_PUBLIC    = 0;
export const SEC_SENSITIVE = 1;
export const SEC_PRIVATE   = 2;

export const SECURITY_LEVELS = {
  [SEC_PUBLIC]: { text: 'Public', value: SEC_PUBLIC, color: 'green' },
  [SEC_SENSITIVE]: { text: 'Sensitive', value: SEC_SENSITIVE, color: 'yellow' },
  [SEC_PRIVATE]: { text: 'Private', value: SEC_PRIVATE, color: 'red' },
};

// Languages
export const LANG_HEBREW     = 'he';
export const LANG_ENGLISH    = 'en';
export const LANG_RUSSIAN    = 'ru';
export const LANG_SPANISH    = 'es';
export const LANG_ITALIAN    = 'it';
export const LANG_GERMAN     = 'de';
export const LANG_DUTCH      = 'nl';
export const LANG_FRENCH     = 'fr';
export const LANG_PORTUGUESE = 'pt';
export const LANG_TURKISH    = 'tr';
export const LANG_POLISH     = 'pl';
export const LANG_ARABIC     = 'ar';
export const LANG_HUNGARIAN  = 'hu';
export const LANG_FINNISH    = 'fi';
export const LANG_LITHUANIAN = 'lt';
export const LANG_JAPANESE   = 'ja';
export const LANG_BULGARIAN  = 'bg';
export const LANG_GEORGIAN   = 'ka';
export const LANG_NORWEGIAN  = 'no';
export const LANG_SWEDISH    = 'sv';
export const LANG_CROATIAN   = 'hr';
export const LANG_CHINESE    = 'zh';
export const LANG_PERSIAN    = 'fa';
export const LANG_ROMANIAN   = 'ro';
export const LANG_HINDI      = 'hi';
export const LANG_UKRAINIAN  = 'ua';
export const LANG_MACEDONIAN = 'mk';
export const LANG_SLOVENIAN  = 'sl';
export const LANG_LATVIAN    = 'lv';
export const LANG_SLOVAK     = 'sk';
export const LANG_CZECH      = 'cs';
export const LANG_MULTI      = 'zz';
export const LANG_UNKNOWN    = 'xx';

export const LANGUAGES = {
  [LANG_HEBREW]: { text: 'Hebrew', value: LANG_HEBREW, flag: 'il' },
  [LANG_ENGLISH]: { text: 'English', value: LANG_ENGLISH, flag: 'us' },
  [LANG_RUSSIAN]: { text: 'Russian', value: LANG_RUSSIAN, flag: 'ru' },
  [LANG_SPANISH]: { text: 'Spanish', value: LANG_SPANISH, flag: 'es' },
  [LANG_ITALIAN]: { text: 'Italian', value: LANG_ITALIAN, flag: 'it' },
  [LANG_GERMAN]: { text: 'German', value: LANG_GERMAN, flag: 'de' },
  [LANG_DUTCH]: { text: 'Dutch', value: LANG_DUTCH, flag: 'nl' },
  [LANG_FRENCH]: { text: 'French', value: LANG_FRENCH, flag: 'fr' },
  [LANG_PORTUGUESE]: { text: 'Portuguese', value: LANG_PORTUGUESE, flag: 'pt' },
  [LANG_TURKISH]: { text: 'Turkish', value: LANG_TURKISH, flag: 'tr' },
  [LANG_POLISH]: { text: 'Polish', value: LANG_POLISH, flag: 'pl' },
  [LANG_ARABIC]: { text: 'Arabic', value: LANG_ARABIC, flag: 'sa' },
  [LANG_HUNGARIAN]: { text: 'Hungarian', value: LANG_HUNGARIAN, flag: 'hu' },
  [LANG_FINNISH]: { text: 'Finnish', value: LANG_FINNISH, flag: 'fi' },
  [LANG_LITHUANIAN]: { text: 'Lithuanian', value: LANG_LITHUANIAN, flag: 'lt' },
  [LANG_JAPANESE]: { text: 'Japanese', value: LANG_JAPANESE, flag: 'jp' },
  [LANG_BULGARIAN]: { text: 'Bulgarian', value: LANG_BULGARIAN, flag: 'bg' },
  [LANG_GEORGIAN]: { text: 'Georgian', value: LANG_GEORGIAN, flag: 'ge' },
  [LANG_NORWEGIAN]: { text: 'Norwegian', value: LANG_NORWEGIAN, flag: 'no' },
  [LANG_SWEDISH]: { text: 'Swedish', value: LANG_SWEDISH, flag: 'se' },
  [LANG_CROATIAN]: { text: 'Croatian', value: LANG_CROATIAN, flag: 'hr' },
  [LANG_CHINESE]: { text: 'Chinese', value: LANG_CHINESE, flag: 'cn' },
  [LANG_PERSIAN]: { text: 'Persian', value: LANG_PERSIAN, flag: 'ir' },
  [LANG_ROMANIAN]: { text: 'Romanian', value: LANG_ROMANIAN, flag: 'ro' },
  [LANG_HINDI]: { text: 'Hindi', value: LANG_HINDI, flag: 'in' },
  [LANG_UKRAINIAN]: { text: 'Ukrainian', value: LANG_UKRAINIAN, flag: 'ua' },
  [LANG_MACEDONIAN]: { text: 'Macedonian', value: LANG_MACEDONIAN, flag: 'mk' },
  [LANG_SLOVENIAN]: { text: 'Slovenian', value: LANG_SLOVENIAN, flag: 'si' },
  [LANG_LATVIAN]: { text: 'Latvian', value: LANG_LATVIAN, flag: 'lv' },
  [LANG_SLOVAK]: { text: 'Slovak', value: LANG_SLOVAK, flag: 'sk' },
  [LANG_CZECH]: { text: 'Czech', value: LANG_CZECH, flag: 'cz' },
  [LANG_MULTI]: { text: 'Multi', value: LANG_MULTI },
  [LANG_UNKNOWN]: { text: 'Unknown', value: LANG_UNKNOWN },
};

export const ALL_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_ITALIAN,
  LANG_GERMAN,
  LANG_DUTCH,
  LANG_FRENCH,
  LANG_PORTUGUESE,
  LANG_TURKISH,
  LANG_POLISH,
  LANG_ARABIC,
  LANG_HUNGARIAN,
  LANG_FINNISH,
  LANG_LITHUANIAN,
  LANG_JAPANESE,
  LANG_BULGARIAN,
  LANG_GEORGIAN,
  LANG_NORWEGIAN,
  LANG_SWEDISH,
  LANG_CROATIAN,
  LANG_CHINESE,
  LANG_PERSIAN,
  LANG_ROMANIAN,
  LANG_HINDI,
  LANG_UKRAINIAN,
  LANG_MACEDONIAN,
  LANG_SLOVENIAN,
  LANG_LATVIAN,
  LANG_SLOVAK,
  LANG_CZECH,
  LANG_MULTI,
  LANG_UNKNOWN,
];

export const MAJOR_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
  LANG_SPANISH,
];

export const RTL_LANGUAGES = [
  LANG_HEBREW,
  LANG_ARABIC,
  LANG_PERSIAN,
];

export const I18N_ORDER = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
];

export const LANGUAGE_OPTIONS = ALL_LANGUAGES.map(x => LANGUAGES[x]);

export const MT_VIDEO        = 'video';
export const MT_AUDIO        = 'audio';
export const MT_IMAGE        = 'image';
export const MT_TEXT         = 'text';
export const MT_SHEET        = 'sheet';
export const MT_BANNER       = 'banner';
export const MT_PRESENTATION = 'presentation';

export const MEDIA_TYPES = {
  mp4: { type: MT_VIDEO, sub_type: '', mime_type: 'video/mp4' },
  wmv: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-ms-wmv' },
  flv: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-flv' },
  mov: { type: MT_VIDEO, sub_type: '', mime_type: 'video/quicktime' },
  asf: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-ms-asf' },
  mpg: { type: MT_VIDEO, sub_type: '', mime_type: 'video/mpeg' },
  avi: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-msvideo' },
  mp3: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/mpeg' },
  wma: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/x-ms-wma' },
  mid: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/midi' },
  wav: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/x-wav' },
  aac: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/aac' },
  jpg: { type: MT_IMAGE, sub_type: '', mime_type: 'image/jpeg' },
  gif: { type: MT_IMAGE, sub_type: '', mime_type: 'image/gif' },
  bmp: { type: MT_IMAGE, sub_type: '', mime_type: 'image/bmp' },
  tif: { type: MT_IMAGE, sub_type: '', mime_type: 'image/tiff' },
  zip: { type: MT_IMAGE, sub_type: '', mime_type: 'application/zip' },
  '7z': { type: MT_IMAGE, sub_type: '', mime_type: 'application/x-7z-compressed' },
  rar: { type: MT_IMAGE, sub_type: '', mime_type: 'application/x-rar-compressed' },
  sfk: { type: MT_IMAGE, sub_type: '', mime_type: '' },
  doc: { type: MT_TEXT, sub_type: '', mime_type: 'application/msword' },
  docx: {
    type: MT_TEXT,
    sub_type: '',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  htm: { type: MT_TEXT, sub_type: '', mime_type: 'text/html' },
  html: { type: MT_TEXT, sub_type: '', mime_type: 'text/html' },
  pdf: { type: MT_TEXT, sub_type: '', mime_type: 'application/pdf' },
  epub: { type: MT_TEXT, sub_type: '', mime_type: 'application/epub+zip' },
  rtf: { type: MT_TEXT, sub_type: '', mime_type: 'text/rtf' },
  txt: { type: MT_TEXT, sub_type: '', mime_type: 'text/plain' },
  fb2: { type: MT_TEXT, sub_type: '', mime_type: 'text/xml' },
  rb: { type: MT_TEXT, sub_type: '', mime_type: 'application/x-rocketbook' },
  xls: { type: MT_SHEET, sub_type: '', mime_type: 'application/vnd.ms-excel' },
  swf: { type: MT_BANNER, sub_type: '', mime_type: 'application/x-shockwave-flash' },
  ppt: { type: MT_PRESENTATION, sub_type: '', mime_type: 'application/vnd.ms-powerpoint' },
  pptx: {
    type: MT_PRESENTATION,
    sub_type: '',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  pps: { type: MT_PRESENTATION, sub_type: '', mime_type: 'application/vnd.ms-powerpoint' },
};

export const ALL_FILE_TYPES = [
  MT_VIDEO,
  MT_AUDIO,
  MT_IMAGE,
  MT_TEXT,
  MT_SHEET,
  MT_BANNER,
  MT_PRESENTATION,
];
