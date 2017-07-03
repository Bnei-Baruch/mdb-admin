import words from 'lodash/words';
import capitalize from 'lodash/capitalize';

import { I18N_ORDER, MEDIA_TYPES } from './consts';

export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') {
    return true;
  }

  return Object.getOwnPropertyNames(obj).length <= 0;
};

/**
 * Test a pattern for physical file names
 *
 * @param {String} pattern
 * @returns {Boolean}
 */
export const isValidPattern = pattern => (
  pattern === '' || /^[0-9a-zA-Z^&'@{}[\],$=!\-#()%+]+$/.test(pattern)
);

/**
 * Build hierarchy from a flat map of entities.
 *
 * @param {Map.<int,Object>} nodeMap id => entity
 * @returns {Object} roots and childMap
 */
export const buildHierarchy = (nodeMap) => {
  console.log('COMPUTE: buildHierarchy ', nodeMap.size);
  const roots    = [];
  const childMap = new Map();

  nodeMap.forEach((v, k) => {
    if (v.parent_id) {
      let c = childMap.get(v.parent_id);
      if (!Array.isArray(c)) {
        c = [];
        childMap.set(v.parent_id, c);
      }
      c.push(k);
    } else {
      roots.push(k);
    }
  });

  return { roots, childMap };
};

/**
 * Extract translation in a given language.
 *
 * @param {Object} i18ns I18ns object of an entity
 * @param {Array.<String>} fields Fields to extract from a single i18n
 * @param {Array.<String>} [languages] Language fallback order, defaults to ['he', 'en', 'ru']
 * @returns {Array.<String>} Translated fields
 */
export const extractI18n = (i18ns, fields, languages = I18N_ORDER) => {
  // Order i18ns by language
  const orderedI18ns = [];
  for (let i = 0; i < languages.length; i++) {
    const i18n = i18ns[languages[i]];
    if (i18n) {
      orderedI18ns.push(i18n);
    }
  }

  // Coalesce values per field
  return fields.map((x) => {
    let value;
    for (let i = 0; i < orderedI18ns.length; i++) {
      value = orderedI18ns[i][x];
      if (value) {
        break;
      }
    }
    return value;
  });
};

export const titleize = str => words(str).map(x => capitalize(x)).join(' ');

/**
 * Format the given error into a user friendly string
 * Intended to format axios errors but may be extended to handle other errors as well
 *
 * @see https://github.com/mzabriskie/axios#handling-errors
 *
 * @param error
 * @returns {String}
 */
export const formatError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const msg = error.response.data.error;
    return error.response.statusText + (msg ? `: ${msg}` : '');
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return 'No response from server';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  } else if (typeof error.toString === 'function') {
    return error.toString();
  }
  return error;
};

/**
 * Returns the given string suffix after the last dot '.'
 * The empty string '' is returned if no dots found.
 * @param name {string}
 * @returns {string}
 */
export const filenameExtension = (name) => {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return name.substring(lastDot + 1, name.length);
};

/**
 * Extract type, sub_type and mime_type from a file
 * or infer based file name extension.
 * @param file
 * @returns {{type: String, sub_type: String, mime_type: String}}
 */
export const fileTypes = (file) => {
  let { type, sub_type, mime_type } = file;

  // infer from file extension in DB has nothing
  if (!type) {
    const ext = filenameExtension(file.name);
    ({ type, sub_type, mime_type } = MEDIA_TYPES[ext] || {});
  }

  return { type, sub_type, mime_type };
};

/**
 * Determine which icon to use for the given file object
 * @param file
 * @returns {string}
 */
export const fileIcon = (file) => {
  const { type, mime_type: mime } = fileTypes(file);

  switch (type) {
  case 'audio':
    return 'file audio outline';
  case 'video':
    return 'file video outline';
  case 'image':
    return mime && mime.startsWith('application') ?
      'file archive outline' :
      'file image outline';
  case 'text':
    switch (mime) {
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'file word outline';
    case 'text/xml':
    case 'text/html':
      return 'file code outline';
    case 'application/epub+zip':
    case 'application/x-rocketbook':
    case 'application/pdf':
      return 'file pdf outline';
    case 'text/rtf':
    case 'text/plain':
      return 'file text outline';
    default:
      return 'file text outline';
    }
  case 'sheet':
    return 'file excel outline';
  case 'presentation':
    return 'file powerpoint outline';
  default:
    return 'file outline';
  }
};

/**
 * Returns the url to the physical file
 * @param file
 * @param ext {boolean} include file name extension in url or not
 */
export const physicalFile = (file, ext = false) => {
  let suffix = '';
  if (ext) {
    suffix = `.${filenameExtension(file.name)}`;
  }
  return `http://app.mdb.bbdomain.org/links/${file.uid}${suffix}`;
};
