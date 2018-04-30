import freezeMap from './freezeMap';

// Use these for immutable default values
export const EMPTY_ARRAY     = Object.freeze([]);
export const EMPTY_OBJECT    = Object.freeze({});
export const EMPTY_MAP       = freezeMap(new Map());
export const EMPTY_HIERARCHY = Object.freeze({
  roots: EMPTY_ARRAY,
  childMap: EMPTY_MAP,
});

// Namespaces
export const NS_COLLECTIONS                 = 'collections';
export const NS_COLLECTION_UNITS            = 'collections/content_units';
export const NS_MERGE_UNITS                 = 'content_units/merge_units';
export const NS_UNIT_FILE_UNITS             = 'content_units/files';
export const NS_UNIT_ASSOCIATION_COLLECTION = 'content_units/association_collection';
export const NS_FILE_UNITS                  = 'files/content_units';
export const NS_UNITS                       = 'content_units';
export const NS_FILES                       = 'files';
export const NS_OPERATIONS                  = 'operations';
export const NS_PERSONS                     = 'persons';
export const NS_PUBLISHERS                  = 'publishers';

export const PAGE_SIZE = 50;

// Collection Types
export const CT_DAILY_LESSON       = 'DAILY_LESSON';
export const CT_SPECIAL_LESSON     = 'SPECIAL_LESSON';
export const CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
export const CT_CONGRESS           = 'CONGRESS';
export const CT_VIDEO_PROGRAM      = 'VIDEO_PROGRAM';
export const CT_LECTURE_SERIES     = 'LECTURE_SERIES';
export const CT_CHILDREN_LESSONS   = 'CHILDREN_LESSONS';
export const CT_WOMEN_LESSONS      = 'WOMEN_LESSONS';
export const CT_VIRTUAL_LESSONS    = 'VIRTUAL_LESSONS';
export const CT_MEALS              = 'MEALS';
export const CT_HOLIDAY            = 'HOLIDAY';
export const CT_PICNIC             = 'PICNIC';
export const CT_UNITY_DAY          = 'UNITY_DAY';
export const CT_CLIPS              = 'CLIPS';
export const CT_ARTICLES           = 'ARTICLES';

// Content Unit Types
export const CT_LESSON_PART           = 'LESSON_PART';
export const CT_LECTURE               = 'LECTURE';
export const CT_CHILDREN_LESSON       = 'CHILDREN_LESSON';
export const CT_WOMEN_LESSON          = 'WOMEN_LESSON';
export const CT_VIRTUAL_LESSON        = 'VIRTUAL_LESSON';
export const CT_FRIENDS_GATHERING     = 'FRIENDS_GATHERING';
export const CT_MEAL                  = 'MEAL';
export const CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
export const CT_FULL_LESSON           = 'FULL_LESSON';
export const CT_ARTICLE               = 'ARTICLE';
export const CT_UNKNOWN               = 'UNKNOWN';
export const CT_EVENT_PART            = 'EVENT_PART';
export const CT_CLIP                  = 'CLIP';
export const CT_TRAINING              = 'TRAINING';
export const CT_KITEI_MAKOR           = 'KITEI_MAKOR';
export const CT_PUBLICATION           = 'PUBLICATION';
export const CT_LELO_MIKUD            = 'LELO_MIKUD';

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
  13: CT_CHILDREN_LESSON,
  14: CT_WOMEN_LESSON,
  16: CT_VIRTUAL_LESSON,
  18: CT_FRIENDS_GATHERING,
  19: CT_MEAL,
  20: CT_VIDEO_PROGRAM_CHAPTER,
  21: CT_FULL_LESSON,
  22: CT_ARTICLE,
  27: CT_UNKNOWN,
  28: CT_EVENT_PART,
  29: CT_CLIP,
  30: CT_TRAINING,
  31: CT_KITEI_MAKOR,
  32: CT_VIRTUAL_LESSONS,
  33: CT_CHILDREN_LESSONS,
  34: CT_WOMEN_LESSONS,
  35: CT_CLIPS,
  36: CT_PUBLICATION,
  37: CT_ARTICLES,
  38: CT_LELO_MIKUD,
};

// Collection types
export const COLLECTION_TYPES = {
  [CT_DAILY_LESSON]: { text: CT_DAILY_LESSON, value: 1 },
  [CT_SPECIAL_LESSON]: { text: CT_SPECIAL_LESSON, value: 2 },
  [CT_FRIENDS_GATHERINGS]: { text: CT_FRIENDS_GATHERINGS, value: 3 },
  [CT_CONGRESS]: { text: CT_CONGRESS, value: 4 },
  [CT_VIDEO_PROGRAM]: { text: CT_VIDEO_PROGRAM, value: 5 },
  [CT_LECTURE_SERIES]: { text: CT_LECTURE_SERIES, value: 6 },
  [CT_MEALS]: { text: CT_MEALS, value: 7 },
  [CT_HOLIDAY]: { text: CT_HOLIDAY, value: 8 },
  [CT_PICNIC]: { text: CT_PICNIC, value: 9 },
  [CT_UNITY_DAY]: { text: CT_UNITY_DAY, value: 10 },
  [CT_VIRTUAL_LESSONS]: { text: CT_VIRTUAL_LESSONS, value: 32 },
  [CT_CHILDREN_LESSONS]: { text: CT_CHILDREN_LESSONS, value: 33 },
  [CT_WOMEN_LESSONS]: { text: CT_WOMEN_LESSONS, value: 34 },
  [CT_CLIPS]: { text: CT_CLIPS, value: 35 },
  [CT_ARTICLES]: { text: CT_ARTICLES, value: 37 },
};

// Content Unit types
export const CONTENT_UNIT_TYPES = {
  [CT_LESSON_PART]: { text: CT_LESSON_PART, value: 11 },
  [CT_LECTURE]: { text: CT_LECTURE, value: 12 },
  [CT_CHILDREN_LESSON]: { text: CT_CHILDREN_LESSON, value: 13 },
  [CT_WOMEN_LESSON]: { text: CT_WOMEN_LESSON, value: 14 },
  [CT_VIRTUAL_LESSON]: { text: CT_VIRTUAL_LESSON, value: 16 },
  [CT_FRIENDS_GATHERING]: { text: CT_FRIENDS_GATHERING, value: 18 },
  [CT_MEAL]: { text: CT_MEAL, value: 19 },
  [CT_VIDEO_PROGRAM_CHAPTER]: { text: CT_VIDEO_PROGRAM_CHAPTER, value: 20 },
  [CT_FULL_LESSON]: { text: CT_FULL_LESSON, value: 21 },
  [CT_ARTICLE]: { text: CT_ARTICLE, value: 22 },
  [CT_UNKNOWN]: { text: CT_UNKNOWN, value: 27 },
  [CT_EVENT_PART]: { text: CT_EVENT_PART, value: 28 },
  [CT_CLIP]: { text: CT_CLIP, value: 29 },
  [CT_TRAINING]: { text: CT_TRAINING, value: 30 },
  [CT_KITEI_MAKOR]: { text: CT_KITEI_MAKOR, value: 31 },
  [CT_PUBLICATION]: { text: CT_PUBLICATION, value: 36 },
  [CT_LELO_MIKUD]: { text: CT_LELO_MIKUD, value: 38 },
};

export const COLLECTION_TYPE_OPTIONS   = Array.from(Object.values(COLLECTION_TYPES));
export const CONTENT_UNIT_TYPE_OPTIONS = Array.from(Object.values(CONTENT_UNIT_TYPES));

// Operation Types
export const OP_CAPTURE_START = 'capture_start';
export const OP_CAPTURE_STOP  = 'capture_stop';
export const OP_DEMUX         = 'demux';
export const OP_TRIM          = 'trim';
export const OP_SEND          = 'send';
export const OP_CONVERT       = 'convert';
export const OP_UPLOAD        = 'upload';
export const OP_IMPORT_KMEDIA = 'import_kmedia';
export const OP_SIRTUTIM      = 'sirtutim';
export const OP_INSERT        = 'insert';
export const OP_TRANSCODE     = 'transcode';

export const OPERATION_TYPE_BY_ID = {
  1: OP_CAPTURE_START,
  2: OP_CAPTURE_STOP,
  3: OP_DEMUX,
  4: OP_SEND,
  5: OP_UPLOAD,
  6: OP_TRIM,
  7: OP_IMPORT_KMEDIA,
  8: OP_CONVERT,
  9: OP_SIRTUTIM,
  10: OP_INSERT,
  11: OP_TRANSCODE,
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

export const SITE_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
  LANG_FRENCH,
  LANG_ITALIAN,
  LANG_GERMAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  LANG_TURKISH,
];

export const REQUIRED_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
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
  png: { type: MT_IMAGE, sub_type: '', mime_type: 'image/png' },
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

export const DATE_FORMAT = 'YYYY-MM-DD';

// Genres
export const GR_DOCUMENTARY = 'documentary';
export const GR_LATE_NIGHT  = 'late-night';
export const GR_NEWS        = 'news';
export const GR_TALK_SHOW   = 'talk-show';
export const GR_EDUCATIONAL = 'educational';
export const GR_CHILDREN    = 'children';
export const GR_MOVIES      = 'movies';

export const GENRE_BY_ID = {
  [GR_DOCUMENTARY]: { text: GR_DOCUMENTARY, value: GR_DOCUMENTARY },
  [GR_LATE_NIGHT]: { text: GR_LATE_NIGHT, value: GR_LATE_NIGHT },
  [GR_NEWS]: { text: GR_NEWS, value: GR_NEWS },
  [GR_TALK_SHOW]: { text: GR_TALK_SHOW, value: GR_TALK_SHOW },
  [GR_EDUCATIONAL]: { text: GR_EDUCATIONAL, value: GR_EDUCATIONAL },
  [GR_CHILDREN]: { text: GR_CHILDREN, value: GR_CHILDREN },
  [GR_MOVIES]: { text: GR_MOVIES, value: GR_MOVIES },
};

export const GENRE_OPTIONS = Array.from(Object.values(GENRE_BY_ID));
