// Semantic UI color names -> Tailwind classes.
// Class names must be written out in full so Tailwind can detect them.

export const SOLID = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
  red    : 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  orange : 'bg-orange-500 text-white hover:bg-orange-600 focus-visible:outline-orange-500',
  yellow : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus-visible:outline-yellow-400',
  olive  : 'bg-lime-500 text-white hover:bg-lime-600 focus-visible:outline-lime-500',
  green  : 'bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600',
  teal   : 'bg-teal-500 text-white hover:bg-teal-600 focus-visible:outline-teal-500',
  blue   : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
  violet : 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:outline-violet-600',
  purple : 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:outline-purple-600',
  pink   : 'bg-pink-500 text-white hover:bg-pink-600 focus-visible:outline-pink-500',
  brown  : 'bg-amber-700 text-white hover:bg-amber-800 focus-visible:outline-amber-700',
  grey   : 'bg-gray-500 text-white hover:bg-gray-600 focus-visible:outline-gray-500',
  black  : 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900',
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:outline-gray-400',
};

export const OUTLINE = {
  primary: 'bg-white text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-blue-50',
  red    : 'bg-white text-red-700 ring-1 ring-inset ring-red-600 hover:bg-red-50',
  orange : 'bg-white text-orange-700 ring-1 ring-inset ring-orange-500 hover:bg-orange-50',
  yellow : 'bg-white text-yellow-700 ring-1 ring-inset ring-yellow-400 hover:bg-yellow-50',
  olive  : 'bg-white text-lime-700 ring-1 ring-inset ring-lime-500 hover:bg-lime-50',
  green  : 'bg-white text-green-700 ring-1 ring-inset ring-green-600 hover:bg-green-50',
  teal   : 'bg-white text-teal-700 ring-1 ring-inset ring-teal-500 hover:bg-teal-50',
  blue   : 'bg-white text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-blue-50',
  violet : 'bg-white text-violet-700 ring-1 ring-inset ring-violet-600 hover:bg-violet-50',
  purple : 'bg-white text-purple-700 ring-1 ring-inset ring-purple-600 hover:bg-purple-50',
  pink   : 'bg-white text-pink-700 ring-1 ring-inset ring-pink-500 hover:bg-pink-50',
  brown  : 'bg-white text-amber-800 ring-1 ring-inset ring-amber-700 hover:bg-amber-50',
  grey   : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-400 hover:bg-gray-50',
  black  : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-900 hover:bg-gray-50',
  default: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
};

export const TEXT = {
  primary: 'text-blue-600',
  red    : 'text-red-600',
  orange : 'text-orange-500',
  yellow : 'text-yellow-500',
  olive  : 'text-lime-600',
  green  : 'text-green-600',
  teal   : 'text-teal-600',
  blue   : 'text-blue-600',
  violet : 'text-violet-600',
  purple : 'text-purple-600',
  pink   : 'text-pink-600',
  brown  : 'text-amber-700',
  grey   : 'text-gray-500',
  black  : 'text-gray-900',
};

// Soft background + text, used for badges / attached headers.
export const SOFT = {
  primary: 'bg-blue-50 text-blue-800',
  red    : 'bg-red-50 text-red-800',
  orange : 'bg-orange-50 text-orange-800',
  yellow : 'bg-yellow-50 text-yellow-800',
  olive  : 'bg-lime-50 text-lime-800',
  green  : 'bg-green-50 text-green-800',
  teal   : 'bg-teal-50 text-teal-800',
  blue   : 'bg-blue-50 text-blue-800',
  violet : 'bg-violet-50 text-violet-800',
  purple : 'bg-purple-50 text-purple-800',
  pink   : 'bg-pink-50 text-pink-800',
  brown  : 'bg-amber-50 text-amber-900',
  grey   : 'bg-gray-100 text-gray-700',
  black  : 'bg-gray-800 text-white',
  default: 'bg-gray-100 text-gray-700',
};

export const BORDER_TOP = {
  primary: 'border-t-2 border-t-blue-600',
  red    : 'border-t-2 border-t-red-600',
  orange : 'border-t-2 border-t-orange-500',
  yellow : 'border-t-2 border-t-yellow-400',
  olive  : 'border-t-2 border-t-lime-500',
  green  : 'border-t-2 border-t-green-600',
  teal   : 'border-t-2 border-t-teal-500',
  blue   : 'border-t-2 border-t-blue-600',
  violet : 'border-t-2 border-t-violet-600',
  purple : 'border-t-2 border-t-purple-600',
  pink   : 'border-t-2 border-t-pink-500',
  brown  : 'border-t-2 border-t-amber-700',
  grey   : 'border-t-2 border-t-gray-500',
  black  : 'border-t-2 border-t-gray-900',
};

export const pick = (map, color, fallback = 'default') => map[color] || map[fallback] || '';
